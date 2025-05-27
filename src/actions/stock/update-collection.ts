"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"
import { createCollectionSchema as updateCollectionSchema } from "@/schemas/stock.schemas"
import type { Collection } from "@prisma/client"

type UpdateCollectionForm = {
  id: Collection["id"]
  oldName: Collection["name"]
  newName: Collection["name"]
}

export async function updateCollection({
  id,
  oldName,
  newName
}: UpdateCollectionForm) {
  try {
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    const schemaValidation = updateCollectionSchema.safeParse({
      name: newName
    })

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.collection.update({
        where: {
          id,
          name: oldName
        },
        data: {
          name: newName
        }
      })

      const userId = session.user.id

      await tx.userMovement.create({
        data: {
          name: "update",
          description: `Collection ${oldName} updated to ${newName}`,
          userId
        }
      })
    })

    revalidatePath("/dashboard/stocks")
    revalidatePath("/dashboard/stocks/[id]")

    return {
      ok: true,
      message: "Collection updated successfully"
    }
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update collection"
    }
  }
}
