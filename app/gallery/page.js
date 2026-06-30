"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

function czyWideo(nazwa) {
  return nazwa.match(/\.(mp4|mov|webm)$/i)
}

export default function Gallery() {
  const [zdjecia, setZdjecia] = useState([])
  const [wybranyIndex, setWybranyIndex] = useState(null)
  const [ladowanie, setLadowanie] = useState(true)
  const [dotykStart, setDotykStart] = useState(null)

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

  // Nawigacja klawiaturą (strzałki na komputerze)
  function nastepneZdjecie() {
    setWybranyIndex((i) => (i + 1) % zdjecia.length)
  }

  function poprzednieZdjecie() {
    setWybranyIndex((i) => (i - 1 + zdjecia.length) % zdjecia.length)
  }

  // Nawigacja klawiaturą (strzałki na komputerze)
  useEffect(() => {
    function obslugaKlawiszy(e) {
      if (wybranyIndex === null) return
      if (e.key === "ArrowRight") setWybranyIndex((i) => (i + 1) % zdjecia.length)
      if (e.key === "ArrowLeft") setWybranyIndex((i) => (i - 1 + zdjecia.length) % zdjecia.length)
      if (e.key === "Escape") setWybranyIndex(null)
    }
    window.addEventListener("keydown", obslugaKlawiszy)
    return () => window.removeEventListener("keydown", obslugaKlawiszy)
  }, [wybranyIndex, zdjecia.length])

  // Obsługa swipe na telefonie
  function dotykPoczatek(e) {
    setDotykStart(e.touches[0].clientX)
  }

  function dotykKoniec(e) {
    if (dotykStart === null) return
    const dotykKoniec = e.changedTouches[0].clientX
    const roznica = dotykStart - dotykKoniec

    if (roznica > 50) nastepneZdjecie()      // swipe w lewo = następne
    if (roznica < -50) poprzednieZdjecie()    // swipe w prawo = poprzednie

    setDotykStart(null)
  }

  const wybrane = wybranyIndex !== null ? zdjecia[wybranyIndex] : null

  return (
    <main className="min-h-screen bg-white p-6">

      {/* Nagłówek */}
      <div className="max-w-sm mx-auto mb-6 flex items-center justify-between">
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
          ← Wróć
        </Link>
        <h1 className="text-gray-900 font-semibold tracking-tight">
          Galeria gości
        </h1>
        <span className="text-gray-400 text-sm">
          {zdjecia.length} zdjęć
        </span>
      </div>

      {/* Ładowanie */}
      {ladowanie && (
        <div className="max-w-sm mx-auto text-center py-16">
          <p className="text-gray-400 text-sm">Ładowanie zdjęć...</p>
        </div>
      )}

      {/* Pusta galeria */}
      {!ladowanie && zdjecia.length === 0 && (
        <div className="max-w-sm mx-auto text-center py-16 flex flex-col items-center gap-4">
          <p className="text-5xl">📷</p>
          <p className="text-gray-900 font-medium">Brak zdjęć</p>
          <p className="text-gray-400 text-sm">Bądź pierwszy i dodaj zdjęcie!</p>
        </div>
      )}

      {/* Siatka zdjęć i wideo */}
      {!ladowanie && zdjecia.length > 0 && (
        <div className="max-w-sm mx-auto grid grid-cols-3 gap-1">
          {zdjecia.map((zdjecie, index) => (
            <div
              key={zdjecie.nazwa}
              onClick={() => setWybranyIndex(index)}
              className="aspect-square bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative"
            >
              {czyWideo(zdjecie.nazwa) ? (
                <>
                  <video
                    src={zdjecie.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="text-2xl">▶️</span>
                  </div>
                </>
              ) : (
                <Image
                  src={zdjecie.url}
                  alt={zdjecie.nazwa}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Przycisk dodaj */}
      <div className="max-w-sm mx-auto mt-6">
        <Link
          href="/upload"
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 rounded-2xl text-base transition-colors flex items-center justify-center"
        >
          📷 Dodaj swoje zdjęcia
        </Link>
      </div>

      {/* Modal podglądu z nawigacją */}
      {wybrane && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
          onTouchStart={dotykPoczatek}
          onTouchEnd={dotykKoniec}
        >
          {/* Tło - klik zamyka */}
          <div
            className="absolute inset-0"
            onClick={() => setWybranyIndex(null)}
          />

          {/* Przycisk zamknij */}
          <button
            onClick={() => setWybranyIndex(null)}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl z-10 w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>

          {/* Strzałka lewo - tylko desktop */}
          <button
            onClick={(e) => { e.stopPropagation(); poprzednieZdjecie() }}
            className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl z-10 w-12 h-12 items-center justify-center"
          >
            ‹
          </button>

          {/* Strzałka prawo - tylko desktop */}
          <button
            onClick={(e) => { e.stopPropagation(); nastepneZdjecie() }}
            className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl z-10 w-12 h-12 items-center justify-center"
          >
            ›
          </button>

          {/* Zawartość */}
          <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden z-10">
            {czyWideo(wybrane.nazwa) ? (
              <video
                src={wybrane.url}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <Image
                src={wybrane.url}
                alt={wybrane.nazwa}
                fill
                className="object-contain"
              />
            )}
          </div>

          {/* Licznik pozycji */}
          <p className="absolute bottom-8 text-white/40 text-xs">
            {wybranyIndex + 1} / {zdjecia.length}
          </p>
        </div>
      )}

    </main>
  )
}