"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"
import { stockVariantsSchema } from "@/schemas/stocks.schemas"
import { ClothesVariant } from "@prisma/client"
import { revalidatePath } from "next/cache"

type UpdateClothesVariantStock = {
  id: ClothesVariant["id"]
  size: ClothesVariant["size"]
  stock: ClothesVariant["stock"]
}

export async function updateClothesVariantStock(
  data: UpdateClothesVariantStock
) {
  try {
    const session = await auth()
    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    const userId = session.user.id

    const { id, size, stock } = data

    const schemaValidation = stockVariantsSchema.safeParse({ size, stock })

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    await prisma.$transaction(async (tx) => {
      const variant = await tx.clothesVariant.findFirst({
        where: { clothesId: id, size },
        include: {
          clothes: {
            select: {
              design: true,
              color: true
            }
          }
        }
      })

      if (!variant) {
        throw new Error(`Variant with size ${size} not found`)
      }

      await tx.clothesVariant.update({
        where: { id: variant.id },
        data: { stock }
      })

      await tx.userMovement.create({
        data: {
          userId,
          name: "update",
          description: `Updated stock for variant ${variant.clothes.design} - ${variant.clothes.color} to ${stock}`
        }
      })
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/stock/[id]")

    return {
      ok: true,
      message: "Stock updated successfully"
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error updating stock"
    }
  }
}
