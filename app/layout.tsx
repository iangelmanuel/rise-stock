import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/provider/providers"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Rise App",
  description: "This is the Rise App, a web application for managing stocks.",
  keywords: ["stocks", "inventory", "management", "sales"],
  creator: "Angel DM",
  openGraph: {
    title: "Rise App",
    description: "This is the Rise App, a web application for managing stocks.",
    url: process.env.SITE_URL || "http://localhost:3000",
    siteName: "Rise App",
    images: [
      {
        url: "/assets/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Rise App Open Graph Image"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Rise App",
    description: "This is the Rise App, a web application for managing stocks.",
    images: ["/assets/images/logo.webp"],
    creator: "@iangelmanuel"
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/shortcut-icon.png"
  },
  robots: {
    index: false,
    follow: false,
    nocache: false,
    noimageindex: false,
    nosnippet: false
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head />
      <body>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>
            {children}
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  )
}
