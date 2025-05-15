"use server"

import { prisma } from "@/lib/prisma-config"

export async function getAllCollection() {
  try {
    const collection = await prisma.collection.findMany({
      include: {
        clothes: {
          select: {
            id: true
          }
        }
      }
    })

    if (!collection) return []

    return collection
  } catch (error) {
    return []
  }
}
