"use server"

import { prisma } from "@/lib/prisma-config"

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true
      }
    })

    return users
  } catch (error) {
    return undefined
  }
}
