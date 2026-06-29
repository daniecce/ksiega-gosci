import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      
      {/* Karta eventu */}
      <div className="bg-gray-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center gap-6">
        
        {/* Zdjęcie pary */}
        <Image
          src="/para.jpg"
          alt="Karolina i Daniel"
          width={120}
          height={120}
          className="rounded-full object-cover w-32 h-32"
        />

        {/* Tytuł */}
        <div className="text-center">
          <h1 className="text-white text-2xl font-semibold">
            Wesele Karoliny i Daniela
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            11 Lipca 2026 · Miodowy Zakątek
          </p>
        </div>

        {/* Przyciski */}
        <div className="w-full flex flex-col gap-3">
          <Link href="/upload" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 rounded-2xl text-lg transition-colors text-center block">
            📷 Dodaj zdjęcia
          </Link>
          <Link href="/gallery" className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 rounded-2xl text-lg transition-colors text-center block">
            🖼️ Zobacz galerię
          </Link>
        </div>

      </div>
    </main>
  )
}