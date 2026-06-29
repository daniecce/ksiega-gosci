"use client"

import { useState } from "react"
import Link from "next/link"

export default function Upload() {
  const [pliki, setPliki] = useState([])
  const [wysylanie, setWysylanie] = useState(false)
  const [sukces, setSukces] = useState(false)

  function wybierzPliki(e) {
    const wybrane = Array.from(e.target.files)
    setPliki(wybrane)
  }

  async function wyslijPliki() {
  if (pliki.length === 0) return

  setWysylanie(true)

  try {
    // Spakuj pliki do FormData
    const formData = new FormData()
    for (const plik of pliki) {
      formData.append("pliki", plik)
    }

    // Wyślij na serwer
    const odpowiedz = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const dane = await odpowiedz.json()

    if (dane.ok) {
      setSukces(true)
    } else {
      alert("Błąd: " + dane.error)
    }

  } catch (blad) {
    alert("Błąd połączenia z serwerem")
    console.error(blad)
  } finally {
    setWysylanie(false)
  }
}

  // Ekran sukcesu
  if (sukces) {
    return (
      <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center gap-6 text-center">
          <p className="text-6xl">✅</p>
          <h1 className="text-white text-2xl font-semibold">
            Dziękujemy!
          </h1>
          <p className="text-gray-400">
            Twoje zdjęcia trafiły do księgi gości
          </p>
          <button
            onClick={() => { setPliki([]); setSukces(false) }}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 rounded-2xl transition-colors"
          >
            Dodaj więcej
          </button>
          <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
            Wróć na stronę główną
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="bg-gray-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col gap-6">

        {/* Przycisk powrotu */}
        <Link href="/" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
          ← Wróć
        </Link>

        {/* Nagłówek */}
        <div>
          <h1 className="text-white text-xl font-semibold">
            Dodaj swoje zdjęcia
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Maksymalnie 20 plików
          </p>
        </div>

        {/* Strefa uploadu */}
        <label className="border-2 border-dashed border-gray-700 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-500 transition-colors">
          <p className="text-4xl">📷</p>
          <p className="text-white font-medium">Stuknij aby wybrać</p>
          <p className="text-gray-500 text-sm">Zdjęcia lub wideo</p>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={wybierzPliki}
          />
        </label>

        {/* Lista wybranych plików */}
        {pliki.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-sm">
              Wybrano: {pliki.length} plików
            </p>
            {pliki.map((plik, index) => (
              <div key={index} className="bg-gray-800 rounded-xl px-4 py-2">
                <p className="text-white text-sm">{plik.name}</p>
                <p className="text-gray-500 text-xs">
                  {(plik.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Przycisk wyślij */}
        <button
          onClick={wyslijPliki}
          disabled={pliki.length === 0 || wysylanie}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-4 rounded-2xl text-lg transition-colors"
        >
          {wysylanie ? "Wysyłanie..." : "Wyślij do księgi"}
        </button>

      </div>
    </main>
  )
}