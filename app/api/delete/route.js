import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"

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
    const { nazwa, haslo } = await request.json()

    // Sprawdź hasło admina
    if (haslo !== process.env.ADMIN_HASLO) {
      return Response.json({ error: "Złe hasło" }, { status: 401 })
    }

    if (!nazwa) {
      return Response.json({ error: "Brak nazwy pliku" }, { status: 400 })
    }

    await r2.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: nazwa,
    }))

    return Response.json({ ok: true })

  } catch (blad) {
    console.error(blad)
    return Response.json({ error: blad.message }, { status: 500 })
  }
}