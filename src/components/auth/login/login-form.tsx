"use client"

import { useTransition } from "react"
// import Link from "next/link"
import { redirect } from "next/navigation"
import { loginUser } from "@/actions/auth/login.action"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  emailValidation,
  loginFormDefaultValues,
  passwordValidation
} from "@/form-config/auth"
import type { LoginFormData } from "@/types/auth"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ErrorFormMessage } from "../../shared/error-form-message"
import { Label } from "../../ui/label"

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    defaultValues: loginFormDefaultValues
  })

  const onSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      const { ok, message } = await loginUser(data)

      if (ok) {
        toast.success("Login successful", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
        reset()
        redirect("/dashboard")
      } else {
        toast.error("Somethings wrong", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      }
    })
  }

  return (
    <>
      <CardContent>
        <form
          id="login-form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email:</Label>
            <Input
              type="email"
              id="email"
              {...register("email", emailValidation)}
              placeholder="Enter your email"
            />

            {errors.email && (
              <ErrorFormMessage message={errors.email.message} />
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password:</Label>
            <Input
              type="password"
              id="password"
              {...register("password", passwordValidation)}
              placeholder="Enter your password"
            />
            {errors.password && (
              <ErrorFormMessage message={errors.password.message} />
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end">
        {/* <Link
          href="/register"
          className="text-sm text-blue-500 transition-colors hover:text-blue-700 hover:underline"
        >
          Register
        </Link> */}
        <Button
          disabled={isPending}
          form="login-form"
        >
          <ButtonContentLoading
            label="Login"
            isPending={isPending}
          />
        </Button>
      </CardFooter>
    </>
  )
}
