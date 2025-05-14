"use server"

import { prisma } from "@/lib/prisma-config"

export async function deleteProduct(id: string) {
  try {
    await prisma.clothesVariant.deleteMany({
      where: { clothesId: id }
    })

    await prisma.clothes.delete({
      where: { id }
    })

    return {
      ok: true,
      message: "Product deleted successfully"
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    return {
      ok: false,
      message: "Error deleting product"
    }
  }
}
