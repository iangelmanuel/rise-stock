"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import type { OrderStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

export async function updateOrderStatus(id: string, orderStatus: OrderStatus) {
  try {
    const session = await auth()
    if (!session) return { ok: false, message: "Unauthorized" }

    await prisma.order.update({
      where: { id },
      data: {
        orderStatus,
        ...(orderStatus === "DELIVERED" && { paidAt: new Date() })
      }
    })

    revalidatePath("/dashboard/ecommerce-orders")

    return { ok: true, message: "Order status updated successfully" }
  } catch {
    return { ok: false, message: "Error updating order status" }
  }
}
