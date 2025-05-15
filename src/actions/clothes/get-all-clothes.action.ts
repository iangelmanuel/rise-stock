"use server"

import { prisma } from "@/lib/prisma-config"

export async function getAllClothes() {
  try {
    const clothes = await prisma.clothes.findMany({
      include: {
        variants: true,
        collection: true
      }
    })

    if (!clothes) return []

    return clothes
  } catch (error) {
    return []
  }
}
