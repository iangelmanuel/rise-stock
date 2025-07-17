"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"
import { createNewSale } from "@/schemas/sales.schemas"
import type { CreateNewSaleForm } from "@/types/sales"
import type { Sale } from "@prisma/client"

export async function editSale(
  formData: CreateNewSaleForm,
  id: Sale["id"] | undefined
) {
  try {
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    if (!id) {
      return {
        ok: false,
        message: "Sale ID is required"
      }
    }

    const schemaValidation = createNewSale.safeParse(formData)

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.sale.update({
        where: { id },
        data: {
          ...formData
        }
      })

      await tx.userMovement.create({
        data: {
          name: "edit",
          description: `Sale edited for ${formData.client}`,
          userId: session.user.id
        }
      })
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/sales")

    return {
      ok: true,
      message: "Sale edited successfully"
    }
  } catch (error) {
    return { ok: false, message: "Error editing sale" }
  }
}
