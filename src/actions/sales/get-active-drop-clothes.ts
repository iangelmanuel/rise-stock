"use server"

import { prisma } from "../../lib/prisma"

export async function getActiveDropClothes() {
  try {
    const clothes = await prisma.clothes.findMany({
      where: {
        collection: {
          isActive: true
        }
      },
      select: {
        id: true,
        design: true,
        color: true,
        price: true
      }
    })

    return clothes
  } catch {
    return undefined
  }
}
