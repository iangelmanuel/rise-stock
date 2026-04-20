"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "../../lib/prisma"

export async function toggleClientConfirmed(id: string, current: boolean) {
  try {
    const session = await auth()
    if (!session) return { ok: false, message: "Unauthorized" }

    await prisma.client.update({
      where: { id },
      data: { isConfirmed: !current }
    })

    revalidatePath("/dashboard/clients")

    return {
      ok: true,
      message: `Client account ${!current ? "confirmed" : "unconfirmed"} successfully`
    }
  } catch {
    return { ok: false, message: "Error updating client status" }
  }
}
