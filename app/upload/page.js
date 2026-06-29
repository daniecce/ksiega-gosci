"use client"

import { useState } from "react"
import Link from "next/link"

const MAX_PLIKOW = 20
const MAX_ZDJECIE_MB = 25
const MAX_WIDEO_MB = 100

export default function Upload() {
  const [pliki, setPliki] = useState([])
  const [wysylanie, setWysylanie] = useState(false)
  const [sukces, setSukces] = useState(false)
  const [blad, setBlad] = useState(null)

  function wybierzPliki(e) {
    const wybrane = Array.from(e.target.files)
    setBlad(null)

    // Sprawdź liczbę plików
    if (wybrane.length > MAX_PLIKOW) {
      setBlad(`Możesz wybrać maksymalnie ${MAX_PLIKOW} plików naraz`)
      return
    }

    // Sprawdź rozmiary
    for (const plik of wybrane) {
      const isVideo = plik.type.startsWith("video/")
      const limitMB = isVideo ? MAX_WIDEO_MB : MAX_ZDJECIE_MB
      const rozmiarMB = plik.size / 1024 / 1024

      if (rozmiarMB > limitMB) {
        setBlad(`"${plik.name}" jest za duży. Limit: ${limitMB} MB`)
        return
      }
    }

    setPliki(wybrane)
  }

  async function wyslijPliki() {
    if (pliki.length === 0) return
    setWysylanie(true)
    setBlad(null)
    try {
      const formData = new FormData()
      for (const plik of pliki) {
        formData.append("pliki", plik)
      }
      const odpowiedz = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const dane = await odpowiedz.json()
      if (dane.ok) {
        setSukces(true)
      } else {
        setBlad("Błąd: " + dane.error)
      }
    } catch (err) {
      setBlad("Błąd połączenia z serwerem")
      console.error(err)
    } finally {
      setWysylanie(false)
    }
  }

  // Ekran sukcesu
  if (sukces) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
          <p className="text-7xl">✅</p>
          <div>
            <h1 className="text-gray-900 text-2xl font-semibold tracking-tight">
              Dziękujemy!
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Twoje zdjęcia trafiły do księgi gości
            </p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => { setPliki([]); setSukces(false) }}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 rounded-2xl transition-colors"
            >
              Dodaj więcej
            </button>
            <Link
              href="/gallery"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-4 rounded-2xl transition-colors text-center block"
            >
              Zobacz galerię
            </Link>
          </div>
          <Link href="/" className="text-gray-300 hover:text-gray-500 text-sm transition-colors">
            ← Wróć na stronę główną
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Przycisk powrotu */}
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
          ← Wróć
        </Link>

        {/* Nagłówek */}
        <div>
          <h1 className="text-gray-900 text-2xl font-semibold tracking-tight">
            Dodaj swoje zdjęcia
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Maksymalnie {MAX_PLIKOW} plików naraz
          </p>
        </div>

        {/* Limity */}
        <div className="bg-gray-50 rounded-2xl px-4 py-3 flex flex-col gap-1">
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Limity</p>
          <p className="text-gray-600 text-sm">📷 Zdjęcia — max {MAX_ZDJECIE_MB} MB / plik</p>
          <p className="text-gray-600 text-sm">🎬 Wideo — max {MAX_WIDEO_MB} MB / plik</p>
          <p className="text-gray-600 text-sm">📁 Liczba plików — max {MAX_PLIKOW} naraz</p>
        </div>

        {/* Strefa uploadu */}
        <label className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors bg-gray-50">
          <p className="text-5xl">📷</p>
          <p className="text-gray-900 font-medium">Stuknij aby wybrać</p>
          <p className="text-gray-400 text-sm">Zdjęcia lub wideo</p>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={wybierzPliki}
          />
        </label>

        {/* Komunikat błędu */}
        {blad && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <p className="text-red-600 text-sm">{blad}</p>
          </div>
        )}

        {/* Lista wybranych plików */}
        {pliki.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-xs uppercase tracking-wide">
              Wybrano: {pliki.length} / {MAX_PLIKOW} plików
            </p>
            {pliki.map((plik, index) => (
              <div key={index} className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center">
                <p className="text-gray-900 text-sm truncate">{plik.name}</p>
                <p className="text-gray-400 text-xs ml-2 shrink-0">
                  {(plik.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Przycisk wyślij */}
        <button
          onClick={wyslijPliki}
          disabled={pliki.length === 0 || wysylanie || !!blad}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-300 text-white font-medium py-4 rounded-2xl text-base transition-colors"
        >
          {wysylanie ? "Wysyłanie..." : "Wyślij do księgi"}
        </button>

      </div>
    </main>
  )
}