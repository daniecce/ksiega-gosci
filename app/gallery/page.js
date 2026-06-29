"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Gallery() {
  const [zdjecia, setZdjecia] = useState([])
  const [wybrane, setWybrane] = useState(null)
  const [ladowanie, setLadowanie] = useState(true)

  useEffect(() => {
    async function pobierzZdjecia() {
      try {
        const odpowiedz = await fetch("/api/photos")
        const dane = await odpowiedz.json()
        setZdjecia(dane.zdjecia)
      } catch (blad) {
        console.error("Błąd pobierania zdjęć:", blad)
      } finally {
        setLadowanie(false)
      }
    }

    pobierzZdjecia()
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 p-6">

      {/* Nagłówek */}
      <div className="max-w-sm mx-auto mb-6 flex items-center justify-between">
        <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
          ← Wróć
        </Link>
        <h1 className="text-white font-semibold">
          Galeria gości
        </h1>
        <span className="text-gray-500 text-sm">
          {zdjecia.length} zdjęć
        </span>
      </div>

      {/* Ładowanie */}
      {ladowanie && (
        <div className="max-w-sm mx-auto text-center py-12">
          <p className="text-gray-400">Ładowanie zdjęć...</p>
        </div>
      )}

      {/* Pusta galeria */}
      {!ladowanie && zdjecia.length === 0 && (
        <div className="max-w-sm mx-auto text-center py-12 flex flex-col items-center gap-4">
          <p className="text-5xl">📷</p>
          <p className="text-white font-medium">Brak zdjęć</p>
          <p className="text-gray-500 text-sm">Bądź pierwszy i dodaj zdjęcie!</p>
        </div>
      )}

      {/* Siatka zdjęć */}
      {!ladowanie && zdjecia.length > 0 && (
        <div className="max-w-sm mx-auto grid grid-cols-3 gap-2">
          {zdjecia.map((zdjecie) => (
            <div
              key={zdjecie.nazwa}
              onClick={() => setWybrane(zdjecie)}
              className="aspect-square bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative"
            >
              <Image
                src={zdjecie.url}
                alt={zdjecie.nazwa}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Przycisk dodaj */}
      <div className="max-w-sm mx-auto mt-6">
        <Link
          href="/upload"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 rounded-2xl text-lg transition-colors flex items-center justify-center"
        >
          📷 Dodaj swoje zdjęcia
        </Link>
      </div>

      {/* Modal podglądu */}
      {wybrane && (
        <div
          onClick={() => setWybrane(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
        >
          <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden">
            <Image
              src={wybrane.url}
              alt={wybrane.nazwa}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

    </main>
  )
}