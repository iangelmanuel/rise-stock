"use server"

import { auth } from "@/auth"
import type { CreateStockClotheForm } from "@/interfaces/stock"
import { prisma } from "@/lib/prisma-config"
import { createStockClothesSchema } from "@/schemas/stocks.schemas"
import { formatCurrency } from "@/utils/format-currency"
import { Collection } from "@prisma/client"
import { revalidatePath } from "next/cache"
// import { v2 as cloudinary } from "cloudinary"

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })

export async function createClothesCollection(
  collectionId: Collection["id"],
  { image, ...restData }: CreateStockClotheForm
) {
  console.log({ data: restData.stock })

  try {
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    const userId = session.user.id

    const schemaValidation = createStockClothesSchema.safeParse(restData)

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    await prisma.$transaction(async (tx) => {
      const newClothes = await tx.clothes.create({
        data: {
          design: schemaValidation.data.design,
          color: schemaValidation.data.color,
          price: schemaValidation.data.price,
          collectionId
        }
      })

      schemaValidation.data.stock.forEach(async (sizeAndStock) => {
        const { size, stock } = sizeAndStock

        await tx.clothesVariant.create({
          data: {
            size,
            stock,
            clothesId: newClothes.id
          }
        })
      })

      await tx.userMovement.create({
        data: {
          userId,
          name: "create",
          description: `New clothes created with name ${newClothes.design} and color ${newClothes.color} with the price: ${formatCurrency(newClothes.price)}`
        }
      })
    })

    revalidatePath("/dashboard/stocks")
    revalidatePath("/dashboard/stocks/[id]")

    return {
      ok: true,
      message: "Clothes collection created successfully"
    }
  } catch (error) {
    console.error({ error })
    return {
      ok: false,
      message: "Error creating clothes collection catch"
    }
  }
}
