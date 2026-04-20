import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllEcommerceOrders } from "@/actions/ecommerce-orders/get-all-ecommerce-orders"
import { OrdersStats } from "@/components/dashboard/ecommerce-orders/orders-stats"
import { ShoppingBag } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export const metadata: Metadata = {
  title: "E-commerce Orders - Rise App",
  description: "Manage orders placed through the online storefront."
}

export default async function EcommerceOrdersPage() {
  const orders = await getAllEcommerceOrders()

  if (!orders) notFound()

  return (
    <>
      <section className="flex flex-col sm:flex-row justify-between items-center my-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="size-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">E-commerce Orders</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Orders placed through the online storefront.
          </p>
        </div>
      </section>

      <OrdersStats orders={orders} />

      <section>
        <DataTable
          columns={columns}
          data={orders}
        />
      </section>
    </>
  )
}
