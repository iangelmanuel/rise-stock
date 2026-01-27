"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { createClothesStockSchema } from "@/schemas/stock.schemas"
import type { CreateClotheStockForm } from "@/types/stock"
import { createCloudinaryImg } from "@/utils/create-cloudinary-img"
import { createSlugForClothes } from "@/utils/create-slug-for-clothes"
import { formatCurrency } from "@/utils/format-currency"
import type { Collection } from "@prisma/client"
import { v2 as cloudinary } from "cloudinary"
import { prisma } from "../../lib/prisma"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

type CollectionData = {
  id: Collection["id"]
  name: Collection["name"]
}

export async function createClothesCollection(
  collectionData: CollectionData,
  { image, ...restData }: CreateClotheStockForm
) {
  try {
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    const userId = session.user.id

    const schemaValidation = createClothesStockSchema.safeParse(restData)

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    const cloudinaryResponse = await createCloudinaryImg({
      designName: schemaValidation.data.design,
      image,
      collectionName: createSlugForClothes(collectionData.name)
    })

    if (
      typeof cloudinaryResponse === "undefined" ||
      cloudinaryResponse === undefined ||
      cloudinaryResponse.length === 0
    ) {
      return {
        ok: false,
        message: "Error uploading image"
      }
    }

    await prisma.$transaction(async (tx) => {
      const newClothes = await tx.clothes.create({
        data: {
          design: schemaValidation.data.design,
          color: schemaValidation.data.color,
          price: schemaValidation.data.price,
          collectionId: collectionData.id
        }
      })

      if (image instanceof FormData && image.has("images")) {
        for (const uploadedImage of cloudinaryResponse) {
          await tx.clothesImage.create({
            data: {
              publicId: uploadedImage.publicId,
              secureUrl: uploadedImage.secureUrl,
              clothesId: newClothes.id
            }
          })
        }
      }

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
    revalidatePath("/dashboard/sales")

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
