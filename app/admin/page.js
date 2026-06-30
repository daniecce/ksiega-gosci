"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import JSZip from "jszip"

function czyWideo(nazwa) {
  return nazwa.match(/\.(mp4|mov|webm)$/i)
}

export default function Admin() {
  const [haslo, setHaslo] = useState("")
  const [zalogowany, setZalogowany] = useState(false)
  const [zdjecia, setZdjecia] = useState([])
  const [ladowanie, setLadowanie] = useState(false)

  async function pobierzZdjecia() {
    setLadowanie(true)
    const odpowiedz = await fetch("/api/photos")
    const dane = await odpowiedz.json()
    setZdjecia(dane.zdjecia)
    setLadowanie(false)
  }

  function zaloguj() {
    if (haslo.length > 0) {
      setZalogowany(true)
      pobierzZdjecia()
    }
  }

  async function usun(nazwa) {
    if (!confirm(`Usunąć "${nazwa}"? Tej operacji nie można cofnąć.`)) return

    const odpowiedz = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nazwa, haslo }),
    })

    const dane = await odpowiedz.json()

    if (dane.ok) {
      setZdjecia(zdjecia.filter((z) => z.nazwa !== nazwa))
    } else {
      alert("Błąd: " + dane.error)
    }
  }
  
  async function pobierzWszystko() {
    if (zdjecia.length === 0) return

    const zip = new JSZip()
    const folder = zip.folder("zdjecia-wesele")
    let bledy = 0

    for (let i = 0; i < zdjecia.length; i++) {
      const zdjecie = zdjecia[i]
      try {
        const odpowiedz = await fetch(zdjecie.url)
        if (!odpowiedz.ok) throw new Error(`HTTP ${odpowiedz.status}`)
        const blob = await odpowiedz.blob()
        folder.file(zdjecie.nazwa, blob)
      } catch (err) {
        console.error(`Błąd pobierania ${zdjecie.nazwa}:`, err)
        bledy++
      }
    }

    if (bledy > 0) {
      alert(`Uwaga: ${bledy} plików nie udało się pobrać. Sprawdź konsolę.`)
    }

    const zawartosc = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(zawartosc)
    const link = document.createElement("a")
    link.href = url
    link.download = "wesele-zdjecia.zip"
    link.click()
    URL.revokeObjectURL(url)
  }

  // Ekran logowania
  if (!zalogowany) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-gray-900 text-2xl font-semibold tracking-tight text-center">
            Panel admina
          </h1>
          <input
            type="password"
            placeholder="Hasło"
            value={haslo}
            onChange={(e) => setHaslo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && zaloguj()}
            className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 outline-none focus:border-gray-400"
          />
          <button
            onClick={zaloguj}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 rounded-2xl transition-colors"
          >
            Zaloguj
          </button>
        </div>
      </main>
    )
  }

  // Panel admina
  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-gray-900 text-xl font-semibold tracking-tight">
            Panel admina · {zdjecia.length} plików
          </h1>
          <button
            onClick={pobierzZdjecia}
            className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
          >
            🔄 Odśwież
          </button>
          <button
              onClick={pobierzWszystko}
              className="bg-black hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              ⬇️ Pobierz wszystko (ZIP)
            </button>
        </div>

        {ladowanie && <p className="text-gray-400 text-sm">Ładowanie...</p>}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {zdjecia.map((zdjecie) => (
            <div key={zdjecie.nazwa} className="bg-gray-50 rounded-xl overflow-hidden">
              <div className="aspect-square relative bg-gray-100">
                {czyWideo(zdjecie.nazwa) ? (
                  <video src={zdjecie.url} className="w-full h-full object-cover" muted />
                ) : (
                  <Image src={zdjecie.url} alt={zdjecie.nazwa} fill className="object-cover" />
                )}
              </div>
              <div className="p-2 flex flex-col gap-1">
                <p className="text-gray-500 text-xs truncate">{zdjecie.nazwa}</p>
                <button
                  onClick={() => usun(zdjecie.nazwa)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                >
                  🗑️ Usuń
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}