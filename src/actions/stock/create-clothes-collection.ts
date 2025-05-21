"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"
import { createClothesStockSchema } from "@/schemas/stock.schemas"
import type { CreateClotheStockForm } from "@/types/stock"
import { createSlugForClothes } from "@/utils/create-slug-for-clothes"
import { formatCurrency } from "@/utils/format-currency"
import type { Collection } from "@prisma/client"
import type { UploadApiResponse } from "cloudinary"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function createClothesCollection(
  collectionData: { id: Collection["id"]; name: Collection["name"] },
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

    if (image instanceof FormData && image.has("image")) {
      const slug = createSlugForClothes(schemaValidation.data.design)
      const imagesFormData = image.get("image") as File

      const byte = await imagesFormData.arrayBuffer()
      const buffer = Buffer.from(byte)

      const cloudinaryResponse = (await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `Rise-Stock/clothes/${collectionData.name}`,
              public_id: `${slug}-${crypto.randomUUID()}-${Date.now()}`,
              resource_type: "image"
            },
            (error, result) => {
              if (error) {
                reject(error)
              } else {
                resolve(result)
              }
            }
          )
          .end(buffer)
      })) as UploadApiResponse | undefined

      if (
        typeof cloudinaryResponse === "undefined" ||
        cloudinaryResponse === undefined
      ) {
        return {
          ok: false,
          message: "Error uploading image to cloudinary"
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

        if (image.has("image")) {
          await tx.clothesImage.create({
            data: {
              publicId: cloudinaryResponse.public_id,
              secureUrl: cloudinaryResponse.secure_url,
              clothesId: newClothes.id
            }
          })
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
    }

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
