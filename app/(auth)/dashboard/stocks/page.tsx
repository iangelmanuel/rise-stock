import type { Metadata } from "next"
import { getAllCollection } from "@/actions/stock/get-all-collection.action"
import { CreateNewCollection } from "@/components/dashboard/stock/create-new-collection"
import { StockStats } from "@/components/dashboard/stock/stock-stats"
import { Layers } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export const metadata: Metadata = {
  title: "Stocks - Rise App",
  description: "Manage your stocks and inventory collections on Rise App."
}

export default async function StocksPage() {
  const collection = await getAllCollection()

  return (
    <>
      <section className="flex flex-col sm:flex-row justify-between items-center my-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="size-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Stock</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            View and manage your inventory collections.
          </p>
        </div>

        <CreateNewCollection />
      </section>

      <StockStats collections={collection} />

      <section>
        <DataTable
          columns={columns}
          data={collection}
        />
      </section>
    </>
  )
}
