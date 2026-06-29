import { readdir } from "fs/promises"
import { join } from "path"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Odczytaj listę plików z folderu
    const folderZdjec = join(process.cwd(), "public", "zdjecia")
    const pliki = await readdir(folderZdjec)

    // Zamień nazwy plików na obiekty z URL
    const zdjecia = pliki.map((nazwa) => ({
      nazwa: nazwa,
      url: `/zdjecia/${nazwa}`,
    }))

    return NextResponse.json({ ok: true, zdjecia })

  } catch (blad) {
    // Folder nie istnieje jeszcze - zwróć pustą listę
    return NextResponse.json({ ok: true, zdjecia: [] })
  }
}