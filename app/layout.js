import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Wesele Karoliny i Daniela 💍",
  description: "Dodaj swoje zdjęcia z naszego wyjątkowego dnia!",
  openGraph: {
    title: "Wesele Karoliny i Daniela 💍",
    description: "Dodaj swoje zdjęcia z naszego wyjątkowego dnia!",
    url: "https://karolina-daniel-ksiega-gosci.vercel.app",
    type: "website",
    images: ["https://karolina-daniel-ksiega-gosci.vercel.app/para.jpg"],
},
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
