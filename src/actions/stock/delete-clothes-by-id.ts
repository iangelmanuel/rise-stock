"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"
import type { Clothes, ClothesImage } from "@prisma/client"
import { v2 as cloudinary } from "cloudinary"

type DeleteClothesData = {
  id: Clothes["id"]
  design: Clothes["design"]
  color: Clothes["color"]
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function deleteClothesById(
  { id, design, color }: DeleteClothesData,
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

    const userId = session.user.id

    if (clothesImage !== null) {
      clothesImage.forEach(async ({ publicId }) => {
        if (publicId !== null) await cloudinary.uploader.destroy(publicId)
      })
    }

    await prisma.$transaction(async (tx) => {
      await tx.clothesVariant.deleteMany({
        where: { clothesId: id }
      })

      if (clothesImage !== null) {
        await tx.clothesImage.deleteMany({
          where: { clothesId: id }
        })
      }

      await tx.clothes.delete({
        where: { id }
      })

      await tx.userMovement.create({
        data: {
          name: "delete",
          description: `Clothes ${design} - ${color} deleted`,
          userId
        }
      })
    })

    revalidatePath("/dashboard/stock")
    revalidatePath("/dashboard/stock/[id]")

    return {
      ok: true,
      message: "Clothes deleted successfully"
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error deleting clothes"
    }
  }
}
