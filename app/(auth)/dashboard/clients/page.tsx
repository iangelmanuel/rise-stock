import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllClients } from "@/actions/clients/get-all-clients"
import { ClientsStats } from "@/components/dashboard/clients/clients-stats"
import { Users } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export const metadata: Metadata = {
  title: "Clients - Rise App",
  description: "Manage e-commerce clients registered on the storefront."
}

export default async function ClientsPage() {
  const clients = await getAllClients()

  if (!clients) notFound()

  return (
    <>
      <section className="flex flex-col sm:flex-row justify-between items-center my-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="size-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            E-commerce clients registered on the storefront.
          </p>
        </div>
      </section>

      <ClientsStats clients={clients} />

      <section>
        <DataTable
          columns={columns}
          data={clients}
        />
      </section>
    </>
  )
}
