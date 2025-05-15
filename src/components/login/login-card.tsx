import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { LoginForm } from "./login-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UserCheck } from "lucide-react"

interface Props {
  register: string
}

export const LoginCard = ({ register }: Props) => {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-center mb-5">
        Rise Clothes Manager
      </h1>

      {register === "success" && (
        <Alert
          className="w-96 mb-5"
          variant="success"
        >
          <UserCheck className="h-4 w-4" />
          <AlertTitle>Register successful</AlertTitle>
          <AlertDescription>
            You can now login with your email and password.
          </AlertDescription>
        </Alert>
      )}

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
