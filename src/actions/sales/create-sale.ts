"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { createNewSale } from "@/schemas/sales.schemas"
import type { CreateNewSaleForm } from "@/types/sales"
import { getPriceWithDiscount } from "@/utils/format-discount"
import { prisma } from "../../lib/prisma"

export async function createSale(formData: CreateNewSaleForm, force = false) {
  try {
    const session = await auth()

    if (!session) {
      return { ok: false, message: "Unauthorized" }
    }

    const userId = session.user.id

    const schemaValidation = createNewSale.safeParse(formData)

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    const { clotheId, clotheSize } = schemaValidation.data

    await prisma.$transaction(async (tx) => {
      const clothe = await tx.clothes.findUnique({
        where: { id: clotheId }
      })

      if (!clothe) throw new Error("Clothes not found")

      // Find the specific variant (size)
      const variant = await tx.clothesVariant.findFirst({
        where: { clothesId: clotheId, size: clotheSize }
      })

      // Block if no stock and not forced
      if (!force && (!variant || variant.stock <= 0)) {
        throw new Error("NO_STOCK")
      }

      const totalOfSale =
        schemaValidation.data.delivery + clothe.price

      await tx.sale.create({
        data: {
          total: clothe.price,
          ...schemaValidation.data
        }
      })

      // Decrement stock only if variant exists and has stock remaining
      if (variant && variant.stock > 0) {
        await tx.clothesVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: 1 } }
        })
      }

      await tx.userMovement.create({
        data: {
          name: "create",
          description: `Sale created for ${formData.client} - ${totalOfSale}${formData.delivery ? " with delivery " + formData.delivery : " without delivery"}${force ? " (forced — no stock)" : ""}`,
          userId
        }
      })
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/sales")
    revalidatePath("/dashboard/stocks")

    return { ok: true, message: "Sale created successfully" }
  } catch (error) {
    if (error instanceof Error && error.message === "NO_STOCK") {
      return { ok: false, message: "NO_STOCK", noStock: true as const }
    }
    return {
      ok: false,
      message: "An error occurred while creating the sale."
    }
  }
}
