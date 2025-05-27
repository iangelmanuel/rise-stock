"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"
import { createCollectionSchema } from "@/schemas/stock.schemas"
import type { Collection } from "@prisma/client"

export async function createCollection(name: Collection["name"]) {
  try {
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    const schemaValidation = createCollectionSchema.safeParse({ name })

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.collection.create({
        data: { name }
      })

      await tx.userMovement.create({
        data: {
          name: "create",
          description: `Collection "${name}" created`,
          userId: session.user.id
        }
      })
    })
    revalidatePath("/dashboard/stocks")
    revalidatePath("/dashboard/stocks/[id]")

    return {
      ok: true,
      message: "Collection created successfully"
    }
  } catch (error) {
    return {
      ok: false,
      message: "Failed to create collection"
    }
  }
}
