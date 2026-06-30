import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const MAX_ROZMIAR_ZDJECIA = 25 * 1024 * 1024
const MAX_ROZMIAR_WIDEO = 100 * 1024 * 1024

const DOZWOLONE_TYPY = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "video/mp4",
  "video/quicktime",
]

const rateLimitMap = new Map()

function checkRateLimit(ip) {
  const teraz = Date.now()
  const okno = 10 * 60 * 1000
  const wpis = rateLimitMap.get(ip) || { count: 0, start: teraz }

  if (teraz - wpis.start > okno) {
    rateLimitMap.set(ip, { count: 1, start: teraz })
    return false
  }
  if (wpis.count >= 30) return true

  rateLimitMap.set(ip, { count: wpis.count + 1, start: wpis.start })
  return false
}

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown"
    if (checkRateLimit(ip)) {
      return Response.json(
        { error: "Zbyt wiele plików. Spróbuj za 10 minut." },
        { status: 429 }
      )
    }

    const { nazwa, typ, rozmiar } = await request.json()

    if (!DOZWOLONE_TYPY.includes(typ)) {
      return Response.json(
        { error: `Niedozwolony typ pliku: ${typ}` },
        { status: 400 }
      )
    }

    const isVideo = typ.startsWith("video/")
    const limit = isVideo ? MAX_ROZMIAR_WIDEO : MAX_ROZMIAR_ZDJECIA
    if (rozmiar > limit) {
      return Response.json(
        { error: `Plik za duży. Maksimum: ${limit / 1024 / 1024} MB` },
        { status: 400 }
      )
    }
    if (rozmiar === 0) {
      return Response.json({ error: "Plik jest pusty" }, { status: 400 })
    }

    const kluczPliku = `${Date.now()}-${nazwa.replace(/[^a-zA-Z0-9._-]/g, "_")}`

    const presignedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: kluczPliku,
        ContentType: typ,
      }),
      { expiresIn: 300 }  // przepustka ważna 5 minut
    )

    return Response.json({ ok: true, presignedUrl, kluczPliku })

  } catch (blad) {
    console.error(blad)
    return Response.json({ error: blad.message }, { status: 500 })
  }
}