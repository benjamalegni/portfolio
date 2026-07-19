import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono as GeistMono } from "next/font/google"
import "./globals.css"

const geistMono = GeistMono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Luka Malegni - Portfolio",
  description: 'This is Luka Malegni\'s portfolio website, showcasing his work and projects in web development and design.',
  metadataBase: new URL('https://malegni.com'),
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <body className={`${geistMono.className} bg-black text-white antialiased`}>{children}</body>
    </html>
  )
}
