"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"

export async function deleteSale(id: string) {
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
      await tx.sale.delete({
        where: { id }
      })

      await tx.userMovement.create({
        data: {
          name: "delete",
          description: `Sale deleted with ID ${id}`,
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
