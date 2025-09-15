import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, DM_Serif_Display, Playfair_Display, Source_Sans_3 as Source_Sans_Pro } from "next/font/google"
import "./globals.css"
import AnalyticsTracker from "@/components/AnalyticsTracker"

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-playfair",
// })

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
})

const sourceSans = Source_Sans_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-source-sans",
})

export const metadata: Metadata = {
  title: "Traficare - Panduan Pertolongan Pertama",
  description:
    "Platform edukasi P3K untuk siswa SMA - Pelajari teknik pertolongan pertama yang dapat menyelamatkan nyawa",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${sourceSans.variable} ${dmSans.variable} antialiased`}>
      <body className="font-sans">
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  )
}
