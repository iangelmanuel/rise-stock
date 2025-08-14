"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"
import { updateSaleStatusSchema } from "@/schemas/sales.schemas"
import type { UpdateSaleStatus } from "@/types/sales"
import type { Sale } from "@prisma/client"

export async function updateManyStatusByIds(
  ids: Sale["id"][],
  status: UpdateSaleStatus["status"]
) {
  try {
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        const sale = await tx.sale.findUnique({
          where: { id }
        })

        if (!sale) {
          throw new Error(`Sale with ID ${id} not found`)
        }

        const { success, data } = updateSaleStatusSchema.safeParse({ status })

        if (!success) {
          throw new Error("Invalid status value")
        }

        await tx.sale.update({
          where: { id },
          data: { status: data.status }
        })

        await tx.userMovement.create({
          data: {
            userId: session.user.id,
            name: "edit",
            description: `Updated sale status to ${data.status}`
          }
        })
      }
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/sales")

    return {
      ok: true,
      message: "Status updated successfully"
    }
  } catch (error) {
    return {
      ok: false,
      message: "Something went wrong while updating the status"
    }
  }
}
