import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CareerPath - Discover Your Perfect Career After 12th",
  description:
    "AI-powered career assessment platform helping Indian students find their ideal career path with personalized recommendations and guidance.",
  keywords: "career guidance, 12th class, career assessment, India, students, career counseling",
  authors: [{ name: "CareerPath Team" }],
  creator: "CareerPath",
  publisher: "CareerPath",
  openGraph: {
    title: "CareerPath - Discover Your Perfect Career After 12th",
    description: "AI-powered career assessment platform helping Indian students find their ideal career path.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerPath - Discover Your Perfect Career After 12th",
    description: "AI-powered career assessment platform helping Indian students find their ideal career path.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
