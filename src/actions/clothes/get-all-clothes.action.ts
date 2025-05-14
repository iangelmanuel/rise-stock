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

    if (!clothes) {
      return {
        ok: false,
        clothes: [],
        message: "No clothes found"
      }
    }

    return {
      ok: true,
      clothes
    }
  } catch (error) {
    console.error("Error fetching all products:", error)
  }
}
