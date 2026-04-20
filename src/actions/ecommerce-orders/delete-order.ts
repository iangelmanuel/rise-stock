"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "../../lib/prisma"

export async function deleteOrder(id: string) {
  try {
    const session = await auth()
    if (!session) return { ok: false, message: "Unauthorized" }

    await prisma.$transaction(async (tx) => {
      await tx.orderTracking.deleteMany({ where: { orderId: id } })
      await tx.orderAddress.deleteMany({ where: { orderId: id } })
      await tx.orderItem.deleteMany({ where: { orderId: id } })
      await tx.order.delete({ where: { id } })
    })

    revalidatePath("/dashboard/ecommerce-orders")

    return { ok: true, message: "Order deleted successfully" }
  } catch {
    return { ok: false, message: "Error deleting order" }
  }
}
