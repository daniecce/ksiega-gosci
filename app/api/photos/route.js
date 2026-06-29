import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3"

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

export async function GET() {
  try {
    const odpowiedz = await r2.send(new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET,
    }))

    const zdjecia = (odpowiedz.Contents || []).map((plik) => ({
      nazwa: plik.Key,
      url: `${process.env.R2_PUBLIC_URL}/${plik.Key}`,
    }))

    return Response.json({ zdjecia })
  } catch (blad) {
    console.error(blad)
    return Response.json({ zdjecia: [] }, { status: 500 })
  }
}