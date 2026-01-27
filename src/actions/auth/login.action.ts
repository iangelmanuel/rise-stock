"use server"

import { signIn } from "@/auth"
import { loginSchema } from "@/schemas/user.schemas"
import { prisma } from "../../lib/prisma"

type LoginUserData = {
  email: string
  password: string
}

export async function loginUser(data: LoginUserData) {
  try {
    const schemaValidation = loginSchema.safeParse(data)

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: "Your email or password is incorrect, please try again"
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: schemaValidation.data.email }
    })

    if (!user) {
      return {
        ok: false,
        message: "Your email or password is incorrect, please try again"
      }
    }

    if (!user.isActive) {
      return {
        ok: false,
        message: "Your account is inactive, please contact support"
      }
    }

    await signIn("credentials", {
      ...schemaValidation.data,
      redirect: false
    })

    return {
      ok: true,
      message: "You will be redirected to the dashboard"
    }
  } catch (error) {
    return {
      ok: false,
      message: "Something went wrong"
    }
  }
}
