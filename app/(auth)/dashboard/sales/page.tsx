import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getActiveDropClothes } from "@/actions/sales/get-active-drop-clothes"
import { getAllSales } from "@/actions/sales/get-all-sales"
import { getAllUsers } from "@/actions/sales/get-all-users"
import { CreateNewSale } from "@/components/dashboard/sales/create-new-sale"
import { SalesStats } from "@/components/dashboard/sales/sales-stats"
import { Receipt } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export const metadata: Metadata = {
  title: "Sales - Rise App",
  description: "Manage your sales data and transactions on Rise App."
}

export default async function SalesPage() {
  const clothes = await getActiveDropClothes()
  const users = await getAllUsers()
  const sales = await getAllSales()

  if (!clothes || !users || !sales) notFound()

  return (
    <>
      <section className="flex flex-col sm:flex-row justify-between items-center my-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="size-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            View and manage your sales transactions.
          </p>
        </div>

        <CreateNewSale
          users={users}
          clothes={clothes}
        />
      </section>

      <SalesStats sales={sales} />

      <section>
        <DataTable
          columns={columns}
          data={sales}
        />
      </section>
    </>
  )
}
