import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    // 1. Odbierz pliki z requestu
    const formData = await request.formData()
    const pliki = formData.getAll("pliki")

    if (pliki.length === 0) {
      return NextResponse.json(
        { error: "Brak plików" },
        { status: 400 }
      )
    }

    // 2. Stwórz folder na zdjęcia jeśli nie istnieje
    const folderZdjec = join(process.cwd(), "public", "zdjecia")
    await mkdir(folderZdjec, { recursive: true })

    // 3. Zapisz każdy plik na dysku
    const zapisanePliki = []

    for (const plik of pliki) {
      // Zamień plik na dane binarne
      const bytes = await plik.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Stwórz unikalną nazwę pliku
      const nazwaPliku = `${Date.now()}-${plik.name}`
      const sciezka = join(folderZdjec, nazwaPliku)

      // Zapisz na dysku
      await writeFile(sciezka, buffer)

      zapisanePliki.push({
        nazwa: nazwaPliku,
        url: `/zdjecia/${nazwaPliku}`,
        rozmiar: plik.size,
      })
    }

    // 4. Zwróć odpowiedź
    return NextResponse.json({
      ok: true,
      pliki: zapisanePliki,
    })

  } catch (blad) {
    console.error("Błąd uploadu:", blad)
    return NextResponse.json(
      { error: "Błąd serwera" },
      { status: 500 }
    )
  }
}