"use server"

import { prisma } from "@/lib/prisma-config"

type UpdateStockInput = {
  variantId: string
  stock: number
}

export async function updateStock({ variantId, stock }: UpdateStockInput) {
  const variant = await prisma.clothesVariant.update({
    where: { id: variantId },
    data: { stock }
  })

  return variant
}
