import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")
  const { user } = session

  return (
    <div className="mt-5">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}</h1>
      <p className="text-lg text-center">Email: {user.email}</p>
    </div>
  )
}
