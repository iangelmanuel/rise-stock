"use server"

import { prisma } from "../../lib/prisma"

export async function getAllCollection() {
  try {
    const collection = await prisma.collection.findMany({
      include: {
        clothes: {
          select: {
            id: true
          },
          orderBy: {
            createdAt: "desc"
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
