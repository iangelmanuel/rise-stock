import { LoginCard } from "@/components/login/login-card"

export default function LoginPage({
  searchParams
}: {
  searchParams: { register: string }
}) {
  const { register } = searchParams
  return <LoginCard register={register} />
}
