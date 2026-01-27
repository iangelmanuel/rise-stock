"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { updateSaleStatusSchema } from "@/schemas/sales.schemas"
import type { UpdateSaleStatus } from "@/types/sales"
import type { Sale } from "@prisma/client"
import { prisma } from "../../lib/prisma"

export async function updateSaleStatus(
  id: Sale["id"],
  status: UpdateSaleStatus["status"]
) {
  try {
    const session = await auth()

    console.log({ id, status })

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    const schemaValidation = updateSaleStatusSchema.safeParse({ status })

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
          status: schemaValidation.data.status
        }
      })

      await tx.userMovement.create({
        data: {
          name: "edtit",
          description: `Sale status updated to ${schemaValidation.data.status}`,
          userId: session.user.id
        }
      })
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/sales")

    return {
      ok: true,
      message: "Sale status updated successfully"
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: "Failed to update sale status"
    }
  }
}
