"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "../../lib/prisma"

type CreateCollectionForm = {
  collectionId: string
  oldName: string
  clothesIds: string[]
}

export async function deleteCollectionById({
  collectionId,
  oldName,
  clothesIds
}: CreateCollectionForm) {
  try {
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    await prisma.$transaction(async (tx) => {
      clothesIds.forEach(async (id) => {
        await tx.clothesVariant.deleteMany({
          where: { clothesId: id }
        })
      })

      await tx.clothes.deleteMany({
        where: { collectionId }
      })

      await tx.collection.delete({
        where: { id: collectionId }
      })

      const userId = session.user.id

      await tx.userMovement.create({
        data: {
          name: "delete",
          description: `Collection ${oldName} deleted`,
          userId
        }
      })
    })

    revalidatePath("/dashboard/stock")
    revalidatePath("/dashboard/stock/[id]")

    return {
      ok: true,
      message: "Collection deleted successfully"
    }
  } catch (error) {
    console.error("Error deleting collection:", error)
    console.error(
      "Error details:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return {
      ok: false,
      message: "Error deleting collection"
    }
  }
}
