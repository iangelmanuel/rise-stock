import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { RegisterForm } from "./register-form"

export const RegisterCard = () => {
  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-5 text-center text-6xl font-bold">
        Rise Clothes Manager
      </h1>

      <Card className="w-96">
        <CardHeader>
          <CardTitle>
            Register
            <span className="text-sm text-gray-500"> (Staff only)</span>
          </CardTitle>

          <CardDescription>
            If you are not staff member, you can&apos;t access this page.
          </CardDescription>
        </CardHeader>

        <RegisterForm />
      </Card>
    </section>
  )
}
