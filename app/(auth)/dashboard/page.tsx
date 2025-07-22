import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAllSales } from "@/actions/sales/get-all-sales"
import { auth } from "@/auth"
import { SalesByCollection } from "@/components/dashboard/charts/sales-by-collection"
import { ColombiaHeatMap } from "@/components/dashboard/charts/sales-by-location"
import { SalesByMonth } from "@/components/dashboard/charts/sales-by-month"
import { SalesBySize } from "@/components/dashboard/charts/sales-by-size"
import { SalesByStatus } from "@/components/dashboard/charts/sales-by-status"
import { SalesByTotal } from "@/components/dashboard/charts/salesByTotal"

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
      <section className="mt-5">
        <h1 className="mb-2 text-2xl font-bold">Welcome, {user.name}</h1>
      </section>

      <section className="mt-5 w-full">
        <SalesByMonth sales={sales} />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <SalesByStatus sales={sales} />
        <SalesByTotal sales={sales} />
        <SalesByCollection sales={sales} />
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <SalesBySize data={sales} />
        <ColombiaHeatMap data={sales} />
      </section>
    </>
  )
}
