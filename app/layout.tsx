import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://betercalls.com"

export const metadata: Metadata = {
  title: {
    default: "BeterCalls - Expert Football Betting Calls",
    template: "%s | BeterCalls",
  },
  description:
    "The ultimate edge in football betting. Get real-time, expert-driven calls and join a community of winners.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "BeterCalls - Expert Football Betting Calls",
    description: "Stop Guessing. Start Winning. Access elite-level football betting calls.",
    url: siteUrl,
    siteName: "BeterCalls",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "BeterCalls - Expert Football Betting Calls",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeterCalls - Expert Football Betting Calls",
    description: "Stop Guessing. Start Winning. Access elite-level football betting calls.",
    images: [`${siteUrl}/og-image.png`],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", inter.className)}>{children}</body>
    </html>
  )
}
