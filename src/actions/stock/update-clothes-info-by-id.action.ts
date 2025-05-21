"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"
import { editClothesInfoSchema } from "@/schemas/stock.schemas"
import type { EditClothesInfoForm } from "@/types/stock"
import { createCloudinaryImg } from "@/utils/create-cloudinary-img"
import { createSlugForClothes } from "@/utils/create-slug-for-clothes"
import type { Clothes, ClothesImage, Collection } from "@prisma/client"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function editClothesInfoById(
  id: Clothes["id"],
  collectionName: Collection["name"],
  data: EditClothesInfoForm,
  publicId: ClothesImage["publicId"] | null
) {
  try {
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Unauthorized"
      }
    }

    const { design, color, price, image } = data
    const schemaValidation = editClothesInfoSchema.safeParse({
      design,
      color,
      price
    })

    if (!schemaValidation.success) {
      return {
        ok: false,
        message: schemaValidation.error.issues[0].message
      }
    }

    const cloudinaryResponse = await createCloudinaryImg({
      designName: schemaValidation.data.design,
      image,
      collectionName: createSlugForClothes(collectionName)
    })

    if (publicId) await cloudinary.uploader.destroy(publicId)

    if (
      typeof cloudinaryResponse === "undefined" ||
      cloudinaryResponse === undefined
    ) {
      return {
        ok: false,
        message: "Error uploading image"
      }
    }

    await prisma.$transaction(async (tx) => {
      const { design, color, price } = schemaValidation.data

      const clothesUpdated = await tx.clothes.update({
        where: {
          id
        },
        data: {
          design,
          color,
          price
        }
      })

      if (image instanceof FormData && image.has("image")) {
        await tx.clothesImage.updateMany({
          where: { clothesId: clothesUpdated.id },
          data: {
            publicId: cloudinaryResponse.public_id,
            secureUrl: cloudinaryResponse.secure_url
          }
        })
      }

      const userId = session.user.id

      await tx.userMovement.create({
        data: {
          name: "update",
          description: `Updated stock variant info for ${design} - ${color} - ${price}`,
          userId
        }
      })
    })

    revalidatePath("/dashboard/stock")
    revalidatePath("/dashboard/stock/[id]")

    return {
      ok: true,
      message: "Stock variant info updated successfully"
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error updating stock variant info"
    }
  }
}
