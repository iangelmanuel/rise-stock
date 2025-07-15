"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"
import { createNewSale } from "@/schemas/sales.schemas"
import type { CreateNewSaleForm } from "@/types/sales"

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

    console.log(schemaValidation.error)

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.sale.create({
        data: {
          ...formData
        }
      })

      await tx.userMovement.create({
        data: {
          name: "create",
          description: `Sale created for ${formData.client} - ${formData.total} ${formData.delivery ? "with delivery" + " " + formData.delivery : "without delivery"}`,
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
