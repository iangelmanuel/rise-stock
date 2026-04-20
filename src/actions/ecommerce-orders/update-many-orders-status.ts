"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import type { OrderStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

export async function updateManyOrdersStatus(
  ids: string[],
  orderStatus: OrderStatus
) {
  try {
    const session = await auth()
    if (!session) return { ok: false, message: "Unauthorized" }

    await prisma.order.updateMany({
      where: { id: { in: ids } },
      data: {
        orderStatus,
        ...(orderStatus === "DELIVERED" && { paidAt: new Date() })
      }
    })

    revalidatePath("/dashboard/ecommerce-orders")

    return {
      ok: true,
      message: `${ids.length} order(s) updated to ${orderStatus} successfully`
    }
  } catch {
    return { ok: false, message: "Error updating orders status" }
  }
}
