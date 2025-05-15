"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import {
  registerFormDefaultValues,
  nameValidation,
  emailValidation,
  passwordValidation,
  repeatPasswordValidation
} from "@/form-config/auth"
import { useTransition } from "react"
import { ErrorFormMessage } from "../shared/error-form-message"
import { toast } from "sonner"
import type { RegisterFormData } from "@/interfaces/auth"
import { registerUser } from "@/actions/user/register.action"
import { redirect } from "next/navigation"

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<RegisterFormData>({
    defaultValues: registerFormDefaultValues
  })

  const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      const { ok, message } = await registerUser(data)

      if (ok) {
        toast.success("Register successful", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
        reset()
        redirect("/login?register=success")
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
            <label htmlFor="name">Name:</label>
            <Input
              type="text"
              id="name"
              {...register("name", nameValidation)}
              placeholder="Enter your name"
            />
            {errors.name && <ErrorFormMessage message={errors.name.message} />}
          </div>

          <div className="grid gap-2">
            <label htmlFor="email">Email:</label>
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
            <label htmlFor="password">Password:</label>
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

          <div className="grid gap-2">
            <label htmlFor="repeatPassword">Repeat Password:</label>
            <Input
              type="password"
              id="repeatPassword"
              {...register("repeatPassword", {
                ...repeatPasswordValidation,
                validate: (value) =>
                  value === watch("password") || "Passwords do not match"
              })}
              placeholder="Repeat your password"
            />
            {errors.repeatPassword && (
              <ErrorFormMessage message={errors.repeatPassword.message} />
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Link
          href="/login"
          className="text-sm text-blue-500 transition-colors hover:text-blue-700 hover:underline"
        >
          Login
        </Link>
        <Button
          disabled={isPending}
          form="login-form"
        >
          {/* TODO */}
          {isPending ? "Loading..." : "Register"}
        </Button>
      </CardFooter>
    </>
  )
}
