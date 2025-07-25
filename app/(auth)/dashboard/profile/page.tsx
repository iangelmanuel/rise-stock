import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getAllSales } from "@/actions/sales/get-all-sales"
import { auth } from "@/auth"
import { EditUserButtons } from "@/components/dashboard/profile/edit-user-buttons"
import { UserAvatar } from "@/components/shared/user-avatar"
import { columns } from "../sales/columns"
import { DataTable } from "../sales/data-table"

export const metadata: Metadata = {
  title: "Profile - Rise App",
  description: "Manage your profile on Rise App."
}

export default async function ProfilePage() {
  const session = await auth()
  const sales = await getAllSales(session?.user.id)

  if (!sales) return []
  if (!session) redirect("/login")

  const user = session.user

  return (
    <>
      <section className="flex justify-center items-end p-5 border-b pb-10">
        <div className="flex sm:flex-col justify-center items-center gap-4">
          <UserAvatar
            userName={user.name}
            avatar={user.image}
            color="bg-muted-foreground text-white"
            textSize="text-2xl sm:text-8xl"
            className="size-16 sm:size-60"
          />

          <div>
            <h1 className="text-2xl font-semibold mt-4 sm:text-center">
              {user.name}
            </h1>

            <p className="text-muted-foreground sm:text-center">{user.email}</p>
          </div>
        </div>

        <EditUserButtons user={user} />
      </section>

      <section className="cointainer mx-auto p-5">
        <h2 className="text-3xl font-bold">My Sales</h2>
        <p className="text-muted-foreground">
          This section will display your sales data once the sales feature is
          implemented.
        </p>

        <DataTable
          columns={columns}
          data={sales}
        />
      </section>
    </>
  )
}
