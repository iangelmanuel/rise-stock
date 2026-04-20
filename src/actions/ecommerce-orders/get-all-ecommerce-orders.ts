"use server"

import { auth } from "@/auth"
import { prisma } from "../../lib/prisma"

export async function getAllEcommerceOrders() {
  try {
    const session = await auth()
    if (!session) return undefined

    const orders = await prisma.order.findMany({
      include: {
        client: {
          select: { id: true, name: true, lastname: true, email: true, phone: true }
        },
        orderItems: {
          include: {
            clothes: {
              select: {
                id: true,
                design: true,
                color: true,
                clothesImage: { select: { id: true, secureUrl: true, publicId: true } }
              }
            }
          }
        },
        orderAddress: true,
        orderTracking: true,
        orderDiscount: {
          select: { code: true, description: true, discount: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return orders
  } catch {
    return undefined
  }
}
