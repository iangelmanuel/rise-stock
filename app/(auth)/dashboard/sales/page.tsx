import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllClothes } from "@/actions/sales/get-all-clothes"
import { getAllSales } from "@/actions/sales/get-all-sales"
import { getAllUsers } from "@/actions/sales/get-all-users"
import { CreateNewSale } from "@/components/dashboard/sales/create-new-sale"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export const metadata: Metadata = {
  title: "Sales - Rise App",
  description: "Manage your sales data and transactions on Rise App."
}

export default async function SalesPage() {
  const clothes = await getAllClothes()
  const users = await getAllUsers()
  const sales = await getAllSales()

  if (!clothes || !users || !sales) notFound()

  return (
    <>
      <section className="flex flex-col sm:flex-row justify-between items-center my-5">
        <div>
          <h1 className="mb-3 text-4xl font-bold">Sales</h1>
          <p>
            This is the sales page. You can view and manage your sales data
            here.
          </p>
        </div>

        <CreateNewSale
          users={users}
          clothes={clothes}
        />
      </section>

      <section>
        <DataTable
          columns={columns}
          data={sales}
        />
      </section>
    </>
  )
}
