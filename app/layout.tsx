import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/provider/providers"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Rise App",
  description:
    "This is the Rise App, a web application for managing stocks and other related tasks."
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
      <body className="antialiased">
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
