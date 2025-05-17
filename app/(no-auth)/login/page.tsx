import { LoginCard } from "@/components/auth/login/login-card"

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function LoginPage(props: { searchParams: SearchParams }) {
  const { register } = await props.searchParams

  return <LoginCard register={register} />
}
