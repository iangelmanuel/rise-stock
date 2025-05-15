import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { auth } from "@/auth"
import "@/styles/globals.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/dashboard/sidebar/main-sidebar"

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
    <SidebarProvider>
      <MainSidebar />

      <main className="p-5 w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
