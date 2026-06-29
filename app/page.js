import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6">

      {/* Karta eventu */}
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Zdjęcie pary */}
        <div className="relative">
          <Image
            src="/para.jpg"
            alt="Karolina i Daniel"
            width={140}
            height={140}
            className="rounded-full object-cover w-36 h-36 shadow-lg"
          />
        </div>

        {/* Tytuł */}
        <div className="text-center">
          <h1 className="text-gray-900 text-3xl font-semibold tracking-tight">
            Wesele Karoliny i Daniela
          </h1>
          <p className="text-gray-400 text-sm mt-2 tracking-wide uppercase">
            11 Lipca 2026 · Miodowy Zakątek
          </p>
        </div>

        {/* Przyciski */}
        <div className="w-full flex flex-col gap-3">
          <Link
            href="/upload"
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 rounded-2xl text-base transition-colors text-center block"
          >
            📷 Dodaj zdjęcia
          </Link>
          <Link
            href="/gallery"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-4 rounded-2xl text-base transition-colors text-center block"
          >
            🖼️ Zobacz galerię
          </Link>
        </div>

        {/* Stopka */}
        <p className="text-gray-300 text-xs tracking-wide">
          WIRTUALNA KSIĘGA GOŚCI
        </p>

      </div>
    </main>
  )
}