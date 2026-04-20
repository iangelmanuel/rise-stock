import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAllSales } from "@/actions/sales/get-all-sales"
import { auth } from "@/auth"
import { SalesByCollection } from "@/components/dashboard/charts/sales-by-collection"
import { SalesByLocation } from "@/components/dashboard/charts/sales-by-location"
import { SalesByMonth } from "@/components/dashboard/charts/sales-by-month"
import { SalesBySize } from "@/components/dashboard/charts/sales-by-size"
import { SalesByStatus } from "@/components/dashboard/charts/sales-by-status"
import { SalesByTotal } from "@/components/dashboard/charts/sales-by-total"
import { LayoutDashboard } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard - Rise App",
  description: "Your dashboard for managing stocks and inventory on Rise App."
}

export default async function DashboardPage() {
  const session = await auth()
  const sales = (await getAllSales()) ?? []

  if (!session) redirect("/login")
  const { user } = session
  return (
    <>
      <section className="mt-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <LayoutDashboard className="size-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.name}
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Here&apos;s an overview of your store&apos;s performance.
        </p>
      </section>

      <section className="mt-5 w-full">
        <SalesByMonth sales={sales} />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <SalesByTotal sales={sales} />
        <SalesByStatus sales={sales} />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <SalesByCollection sales={sales} />
        <SalesBySize data={sales} />
        <SalesByLocation data={sales} />
      </section>
    </>
  )
}
