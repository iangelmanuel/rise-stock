"use server"

import type { Session } from "next-auth"
import { updateUserPasswordSchema } from "@/schemas/user.schemas"
import type { UpdateUserPasswordType } from "@/types/user"
import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"

export async function updateUserPasswordById(
  formData: UpdateUserPasswordType,
  userId: Session["user"]["id"]
) {
  try {
    if (!userId) {
      return {
        ok: false,
        message: "Your ID is required"
      }
    }

    const schemaValidation = updateUserPasswordSchema.safeParse(formData)

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        throw new Error("User not found")
      }

      const { oldPassword, password } = schemaValidation.data

      const isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      )

      if (!isOldPasswordCorrect) {
        throw new Error("Old password is incorrect")
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      await tx.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword
        }
      })
    })

    return {
      ok: true,
      message: "Your password has been updated"
    }
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update your password"
    }
  }
}
