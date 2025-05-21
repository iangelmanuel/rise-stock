"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"
import { editClothesInfoSchema } from "@/schemas/stock.schemas"
import type { EditClothesInfoForm } from "@/types/stock"
import type { Clothes } from "@prisma/client"

export async function editClothesInfoById(
  id: Clothes["id"],
  data: EditClothesInfoForm
) {
  try {
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    const { design, color, price, image } = data
    const schemaValidation = editClothesInfoSchema.safeParse({
      design,
      color,
      price
    })

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    await prisma.$transaction(async (tx) => {
      const { design, color, price } = schemaValidation.data

      await tx.clothes.update({
        where: {
          id
        },
        data: {
          design,
          color,
          price
        }
      })

      const userId = session.user.id

      await tx.userMovement.create({
        data: {
          name: "update",
          description: `Updated stock variant info for ${design} - ${color} - ${price}`,
          userId
        }
      })
    })

    revalidatePath("/dashboard/stock")
    revalidatePath("/dashboard/stock/[id]")

    return {
      ok: true,
      message: "Stock variant info updated successfully"
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error updating stock variant info"
    }
  }
}
