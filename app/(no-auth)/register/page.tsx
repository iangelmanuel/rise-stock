import type { Metadata } from "next"
import { redirect } from "next/navigation"

// import { RegisterCard } from "@/components/auth/register/register-card"

export const metadata: Metadata = {
  title: "Register - Rise App",
  description:
    "Create a new account on Rise App to start managing your stocks and inventory."
}

export default function RegisterPage() {
  // return <RegisterCard />
  return redirect("/login")
}
