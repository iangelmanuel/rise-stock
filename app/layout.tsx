import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/provider/providers"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Rise App",
  description: "This is the Rise App, a web application for managing stocks."
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
