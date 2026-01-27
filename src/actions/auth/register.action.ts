"use server"

import { registerSchema } from "@/schemas/user.schemas"
import type { RegisterFormData } from "@/types/auth"
import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"

export async function registerUser(data: RegisterFormData) {
  try {
    const schemaValidation = registerSchema.safeParse(data)

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    const userExists = await prisma.user.findUnique({
      where: {
        email: schemaValidation.data.email
      }
    })

    if (userExists) {
      return {
        ok: false,
        message: "User already exists."
      }
    }

    const { name, email, password } = schemaValidation.data
    const hashedPassword = bcrypt.hashSync(password, 10)

    await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    return {
      ok: true,
      message: "User registered successfully."
    }
  } catch (error) {
    return {
      ok: false,
      message: "An error occurred while registering the user."
    }
  }
}
