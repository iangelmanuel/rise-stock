"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleCollectionActive(id: string, isActive: boolean) {
  try {
    const session = await auth()
    if (!session) return { ok: false, message: "Unauthorized" }

    await prisma.collection.update({
      where: { id },
      data: { isActive }
    })

    revalidatePath("/dashboard/stocks")

    return {
      ok: true,
      message: isActive ? "Drop activated" : "Drop deactivated"
    }
  } catch {
    return { ok: false, message: "Failed to update drop status" }
  }
}
