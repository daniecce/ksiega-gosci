import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

// ─── Limity ───────────────────────────────────────────────────
const MAX_PLIKOW_NARAZ = 20
const MAX_ROZMIAR_ZDJECIA = 15 * 1024 * 1024   // 15 MB
const MAX_ROZMIAR_WIDEO = 100 * 1024 * 1024    // 100 MB

const DOZWOLONE_TYPY = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",    // iPhone zdjęcia
  "video/mp4",
  "video/quicktime", // iPhone wideo (.mov)
]

// ─── Rate limiting (prosty, w pamięci) ───────────────────────
// Przechowuje ile plików wysłał dany IP w ostatnich 10 minutach
const rateLimitMap = new Map()

function checkRateLimit(ip) {
  const teraz = Date.now()
  const okno = 10 * 60 * 1000  // 10 minut w ms

  const wpis = rateLimitMap.get(ip) || { count: 0, start: teraz }

  // Resetuj licznik jeśli minęło 10 minut
  if (teraz - wpis.start > okno) {
    rateLimitMap.set(ip, { count: 1, start: teraz })
    return false  // nie przekroczono
  }

  // Przekroczono limit
  if (wpis.count >= 30) return true

  // Zwiększ licznik
  rateLimitMap.set(ip, { count: wpis.count + 1, start: wpis.start })
  return false
}

// ─── Endpoint ────────────────────────────────────────────────
export async function POST(request) {
  try {
    // 1. Rate limiting
    const ip = request.headers.get("x-forwarded-for") ?? "unknown"
    if (checkRateLimit(ip)) {
      return Response.json(
        { error: "Zbyt wiele plików. Spróbuj za 10 minut." },
        { status: 429 }
      )
    }

    // 2. Pobierz pliki
    const formData = await request.formData()
    const pliki = formData.getAll("pliki")

    if (pliki.length === 0) {
      return Response.json({ error: "Brak plików" }, { status: 400 })
    }

    // 3. Limit liczby plików naraz
    if (pliki.length > MAX_PLIKOW_NARAZ) {
      return Response.json(
        { error: `Maksymalnie ${MAX_PLIKOW_NARAZ} plików naraz` },
        { status: 400 }
      )
    }

    // 4. Walidacja każdego pliku
    for (const plik of pliki) {
      // Sprawdź typ
      if (!DOZWOLONE_TYPY.includes(plik.type)) {
        return Response.json(
          { error: `Niedozwolony typ pliku: ${plik.type}. Dozwolone: zdjęcia i wideo.` },
          { status: 400 }
        )
      }

      // Sprawdź rozmiar
      const isVideo = plik.type.startsWith("video/")
      const limit = isVideo ? MAX_ROZMIAR_WIDEO : MAX_ROZMIAR_ZDJECIA
      const limitMB = limit / 1024 / 1024

      if (plik.size > limit) {
        return Response.json(
          { error: `Plik "${plik.name}" jest za duży. Maksimum: ${limitMB} MB` },
          { status: 400 }
        )
      }

      // Sprawdź czy plik nie jest pusty
      if (plik.size === 0) {
        return Response.json(
          { error: `Plik "${plik.name}" jest pusty` },
          { status: 400 }
        )
      }
    }

    // 5. Wyślij do R2
    for (const plik of pliki) {
      const bytes = await plik.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const nazwa = `${Date.now()}-${plik.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`

      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: nazwa,
        Body: buffer,
        ContentType: plik.type,
      }))
    }

    return Response.json({ ok: true })

  } catch (blad) {
    console.error(blad)
    return Response.json({ ok: false, error: blad.message }, { status: 500 })
  }
}