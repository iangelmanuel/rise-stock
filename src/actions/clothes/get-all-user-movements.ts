"use server"

import { prisma } from "@/lib/prisma-config"

export async function getAllUserMovements() {
  try {
    const movements = await prisma.userMovement.findMany({
      take: 10,
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    if (!movements) return null

    return movements
  } catch (error) {
    return null
  }
}
