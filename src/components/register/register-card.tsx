import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { RegisterForm } from "./register-form"

export const RegisterCard = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-center mb-5">
        Rise Clothes Manager
      </h1>

      <Card className="w-96">
        <CardHeader>
          <CardTitle>
            Register
            <span className="text-sm text-gray-500">
              {" "}
              (Staff only)
            </span>
          </CardTitle>

          <CardDescription>
            If you are not staff member, you can't access this page.
          </CardDescription>
        </CardHeader>

        <RegisterForm />
      </Card>
    </section>
  )
}
