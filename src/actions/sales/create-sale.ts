"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { createNewSale } from "@/schemas/sales.schemas"
import type { CreateNewSaleForm } from "@/types/sales"
import { getPriceWithDiscount } from "@/utils/format-discount"
import { prisma } from "../../lib/prisma"

export async function createSale(formData: CreateNewSaleForm) {
  try {
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    const userId = session.user.id

    const schemaValidation = createNewSale.safeParse(formData)

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    await prisma.$transaction(async (tx) => {
      const clothe = await tx.clothes.findUnique({
        where: { id: schemaValidation.data.clotheId }
      })

      if (!clothe) {
        throw new Error("Clothes not found")
      }

      const totalOfSale = schemaValidation.data.delivery + clothe.price

      await tx.sale.create({
        data: {
          total: clothe.price,
          ...schemaValidation.data
        }
      })

      await tx.userMovement.create({
        data: {
          name: "create",
          description: `Sale created for ${formData.client} - ${totalOfSale} ${formData.delivery ? "with delivery" + " " + formData.delivery : "without delivery"}`,
          userId
        }
      })
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/sales")

    return {
      ok: true,
      message: "Sale created successfully"
    }
  } catch (error) {
    return {
      ok: false,
      message: "An error occurred while creating the sale."
    }
  }
}
