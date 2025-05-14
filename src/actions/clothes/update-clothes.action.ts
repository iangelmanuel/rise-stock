"use server"

import { prisma } from "@/lib/prisma-config"

type UpdateProductInput = {
  id: string
  design?: string
  color?: string
  collectionId?: string
}

export async function updateProduct({ id, ...data }: UpdateProductInput) {
  const product = await prisma.clothes.update({
    where: { id },
    data
  })

  return product
}
