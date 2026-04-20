"use server"

import { auth } from "@/auth"
import { prisma } from "../../lib/prisma"

export async function getAllClients() {
  try {
    const session = await auth()
    if (!session) return undefined

    const clients = await prisma.client.findMany({
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        phone: true,
        isConfirmed: true,
        isUserDeleted: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { orders: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    return clients
  } catch {
    return undefined
  }
}
