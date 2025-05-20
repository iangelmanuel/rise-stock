"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"
import type { Clothes } from "@prisma/client"

interface DeleteClothesData {
  id: Clothes["id"]
  design: Clothes["design"]
  color: Clothes["color"]
}

export async function deleteClothesById({
  id,
  design,
  color
}: DeleteClothesData) {
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
      await tx.clothesVariant.deleteMany({
        where: { clothesId: id }
      })

      await tx.clothes.delete({
        where: { id }
      })

      await tx.userMovement.create({
        data: {
          name: "delete",
          description: `Clothes ${design} - ${color} deleted`,
          userId
        }
      })
    })

    revalidatePath("/dashboard/stock")
    revalidatePath("/dashboard/stock/[id]")

    return {
      ok: true,
      message: "Clothes deleted successfully"
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error deleting clothes"
    }
  }
}
