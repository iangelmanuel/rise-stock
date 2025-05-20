"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import type { StockVariantsFormData } from "@/interfaces/stock"
import { prisma } from "@/lib/prisma-config"
import { editStockClothesSchema } from "@/schemas/stock.schemas"
import type { Clothes, ClothesVariant } from "@prisma/client"

type ClothesWithVariants = Clothes & {
  variants: ClothesVariant[] | null
}

type UpdateClothesVariantStock = {
  item: ClothesWithVariants
  stock: StockVariantsFormData["stock"]
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

    const { item, stock } = data
    const schemaValidation = editStockClothesSchema.safeParse({ stock })

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    const { design, color, variants } = item

    if (!variants) {
      return {
        ok: false,
        message: "No variants found"
      }
    }

    await prisma.$transaction(async (tx) => {
      const stockToUpdate = schemaValidation.data.stock
      const clothesToUpdateId = item.id

      const userId = session.user.id

      stockToUpdate.forEach(async ({ size, stock }) => {
        await tx.clothesVariant.updateMany({
          where: {
            clothesId: clothesToUpdateId,
            size
          },
          data: {
            stock
          }
        })
      })

      const clothesChanged = stock.map(
        (clothes) => `Size: ${clothes.size} - Stock: ${clothes.stock}`
      )

      await tx.userMovement.create({
        data: {
          userId,
          name: "update",
          description: `Updated stock for variant ${design} - ${color} with stock: ${clothesChanged.join(", ")}`
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
