"use server"

import { prisma } from "@/lib/prisma-config"

type CreateProductInput = {
  design: string
  color: string
  collectionId?: string
  sizes: { size: string; stock: number }[]
}

export async function createClothes(data: CreateProductInput) {
  try {
    const clothes = await prisma.clothes.create({
      data: {
        design: data.design,
        color: data.color,
        collectionId: data.collectionId,
        variants: {
          create: data.sizes
        }
      }
    })

    if (!clothes) {
      return {
        ok: false,
        clothes: [],
        message: "Product not created"
      }
    }

    return {
      ok: true,
      clothes,
      message: "Clothes created successfully"
    }
  } catch (error) {
    console.error("Error creating product:", error)
    return {
      ok: false,
      clothes: [],
      message: "Error creating product"
    }
  }
}
