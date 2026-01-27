"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { editClothesInfoSchema } from "@/schemas/stock.schemas"
import type { EditClothesInfoForm } from "@/types/stock"
import { createCloudinaryImg } from "@/utils/create-cloudinary-img"
import { createSlugForClothes } from "@/utils/create-slug-for-clothes"
import type { Clothes, ClothesImage, Collection } from "@prisma/client"
import { v2 as cloudinary } from "cloudinary"
import { prisma } from "../../lib/prisma"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function editClothesInfoById(
  id: Clothes["id"],
  collectionName: Collection["name"],
  data: EditClothesInfoForm,
  clothesImage: ClothesImage[] | null
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

    let cloudinaryResponse = undefined

    if (clothesImage && image instanceof FormData && image.has("images")) {
      cloudinaryResponse = await createCloudinaryImg({
        designName: schemaValidation.data.design,
        image,
        collectionName: createSlugForClothes(collectionName)
      })

      clothesImage.forEach(async ({ publicId }) => {
        if (publicId) await cloudinary.uploader.destroy(publicId)
      })

      if (
        (typeof cloudinaryResponse === "undefined" ||
          cloudinaryResponse === undefined) &&
        clothesImage
      ) {
        return {
          ok: false,
          message: "Error uploading image"
        }
      }
    }

    await prisma.$transaction(async (tx) => {
      const { design, color, price } = schemaValidation.data

      const clothesUpdated = await tx.clothes.update({
        where: { id },
        data: { design, color, price }
      })

      if (
        cloudinaryResponse !== undefined &&
        cloudinaryResponse.length > 0 &&
        image instanceof FormData &&
        image.has("images")
      ) {
        await tx.clothesImage.deleteMany({
          where: { clothesId: clothesUpdated.id }
        })

        for (const uploadedImage of cloudinaryResponse) {
          await tx.clothesImage.create({
            data: {
              publicId: uploadedImage.publicId,
              secureUrl: uploadedImage.secureUrl,
              clothesId: clothesUpdated.id
            }
          })
        }
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
