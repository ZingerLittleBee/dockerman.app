import Footer from "@/components/ui/Footer"
import { Navigation } from "@/components/ui/Navbar"
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import "./globals.css"
import { siteConfig } from "./siteConfig"


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://dockerman.app"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["Docker", "UI", "Management", "Tauri", "Rust", "Desktop", "App"],
  authors: [
    {
      name: "ZingerBee",
      url: "https://github.com/ZingerLittleBee",
    },
  ],
  creator: "ZingerBee",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@zinger_bee",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
