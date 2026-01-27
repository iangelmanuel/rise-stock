"use server"

import type { Session } from "next-auth"
import { revalidatePath } from "next/cache"
import { updateUserSchema } from "@/schemas/user.schemas"
import type { UpdateUser } from "@/types/user"
import { prisma } from "../../lib/prisma"

export async function updateUserInfoById(
  formData: UpdateUser,
  userId: Session["user"]["id"]
) {
  try {
    if (!userId) {
      return {
        ok: false,
        message: "Your ID is required"
      }
    }

    const validationSchema = updateUserSchema.safeParse(formData)

    if (!validationSchema.success) {
      return {
        ok: false,
        message: validationSchema.error.issues[0].message
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { ...validationSchema.data }
      })

      await tx.userMovement.create({
        data: {
          name: "update",
          description: `User ${formData.name} has been updated`,
          userId
        }
      })
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/profile")
    revalidatePath("/dashboard/sales")

    return {
      ok: true,
      message: "Your info updated successfully"
    }
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update your info"
    }
  }
}
