import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

export async function POST(request) {
  try {
    const formData = await request.formData()
    const pliki = formData.getAll("pliki")

    if (pliki.length === 0) {
      return Response.json({ error: "Brak plików" }, { status: 400 })
    }

    for (const plik of pliki) {
      const bytes = await plik.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const nazwa = `${Date.now()}-${plik.name}`

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