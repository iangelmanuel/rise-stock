import { auth } from "@/auth"

export default async function DashboardPage() {
  const session = await auth()
  const user = session!.user

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-2xl font-bold mb-3">Dashboard</h1>
      <div>
        <p className="text-lg text-center">Welcome, {user?.name}</p>
        <p className="text-lg text-center">Email: {user?.email}</p>
      </div>
    </div>
  )
}
