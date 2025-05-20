import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { MainSidebar } from "@/components/dashboard/sidebar/main-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
    <SidebarProvider>
      <MainSidebar />

      <main className="w-full p-5">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
