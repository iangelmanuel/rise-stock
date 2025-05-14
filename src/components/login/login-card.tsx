import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { LoginForm } from "./login-form"

export const LoginCard = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-center mb-5">
        Rise Clothes Manager
      </h1>

      <Card className="w-96">
        <CardHeader>
          <CardTitle>If you are not logged in, please login</CardTitle>

          <CardDescription>
            If you are not staff member, you can't access this page.
          </CardDescription>
        </CardHeader>

        <LoginForm />
      </Card>
    </section>
  )
}
