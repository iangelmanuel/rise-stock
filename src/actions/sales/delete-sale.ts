"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import type { Sale } from "@prisma/client"
import { prisma } from "../../lib/prisma"

export async function deleteSale(id: Sale["id"], client: Sale["client"]) {
  try {
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    const userId = session.user.id

    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id },
        select: { clotheId: true, clotheSize: true }
      })

      await tx.sale.delete({
        where: { id }
      })

      if (sale) {
        await tx.clothesVariant.updateMany({
          where: { clothesId: sale.clotheId, size: sale.clotheSize },
          data: { stock: { increment: 1 } }
        })
      }

      await tx.userMovement.create({
        data: {
          name: "delete",
          description: `Sale deleted for client ${client}`,
          userId
        }
      })
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/sales")

    return {
      ok: true,
      message: "Sale deleted successfully"
    }
  } catch (error) {
    return {
      ok: false,
      message: "An error occurred while deleting the sale"
    }
  }
}
