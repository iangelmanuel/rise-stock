"use server"

import { prisma } from "@/lib/prisma-config"

export async function getAllClothes() {
  try {
    const clothes = await prisma.clothes.findMany({
      select: {
        id: true,
        design: true,
        color: true,
        price: true
      }
    })

    return clothes
  } catch (error) {
    return undefined
  }
}
