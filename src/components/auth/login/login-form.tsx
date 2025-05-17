"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { loginUser } from "@/actions/auth/login.action"
import {
  emailValidation,
  passwordValidation,
  loginFormDefaultValues
} from "@/form-config/auth"
import { useTransition } from "react"
import { ErrorFormMessage } from "../../shared/error-form-message"
import { toast } from "sonner"
import type { LoginFormData } from "@/interfaces/auth"
import { redirect } from "next/navigation"
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

      <CardFooter className="flex justify-between">
        <Link
          href="/register"
          className="text-sm text-blue-500 transition-colors hover:text-blue-700 hover:underline"
        >
          Register
        </Link>
        <Button
          disabled={isPending}
          form="login-form"
        >
          Login
        </Button>
      </CardFooter>
    </>
  )
}
