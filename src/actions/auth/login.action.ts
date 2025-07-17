"use server"

import { signIn } from "@/auth"
import { loginSchema } from "@/schemas/user.schemas"

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
