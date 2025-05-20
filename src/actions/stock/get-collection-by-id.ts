"use server"

import { prisma } from "@/lib/prisma-config"
import type { Clothes } from "@prisma/client"

export async function getClothesCollectionById(id: Clothes["id"]) {
  try {
    const collection = await prisma.collection.findUnique({
      where: {
        id
      },
      include: {
        clothes: {
          include: {
            variants: true
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
