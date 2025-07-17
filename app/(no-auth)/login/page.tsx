import type { Metadata } from "next"
import { LoginCard } from "@/components/auth/login/login-card"

type SearchParams = Promise<{ [key: string]: string | undefined }>

export const metadata: Metadata = {
  title: "Login - Rise App",
  description:
    "Login to your Rise App account to manage your stocks and inventory."
}

export default async function LoginPage(props: { searchParams: SearchParams }) {
  const { register } = await props.searchParams

  return <LoginCard register={register} />
}
