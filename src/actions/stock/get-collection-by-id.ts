"use server"

import type { Clothes } from "@prisma/client"
import { prisma } from "../../lib/prisma"

export async function getClothesCollectionById(id: Clothes["id"]) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        clothes: {
          include: {
            variants: true,
            clothesImage: true
          }
        }
      }
    })

    if (!collection) return null

    return collection
  } catch (error) {
    return null
  }
}
