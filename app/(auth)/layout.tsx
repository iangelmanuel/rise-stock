import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { auth } from "@/auth"
import { Toaster } from "@/components/ui/sonner"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Dashboard Management",
  description:
    "This page is for the dashboard management the stocks and anything else for Rise, only people with permission can access this page."
}

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster />
        <header></header>

        <main>{children}</main>

        <footer></footer>
      </body>
    </html>
  )
}
