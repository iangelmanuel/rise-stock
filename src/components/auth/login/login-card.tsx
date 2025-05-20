import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { UserCheck } from "lucide-react"
import { LoginForm } from "./login-form"

interface Props {
  register: string | undefined
}

export const LoginCard = ({ register }: Props) => {
  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-5 text-center text-6xl font-bold">
        Rise Clothes Manager
      </h1>

      {register === "success" && (
        <Alert
          className="mb-5 w-96"
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
            If you are not staff member, you can&apos;t access this page.
          </CardDescription>
        </CardHeader>

        <LoginForm />
      </Card>
    </section>
  )
}
