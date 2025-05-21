import type { UploadApiResponse } from "cloudinary"
import { v2 as cloudinary } from "cloudinary"
import { createSlugForClothes } from "./create-slug-for-clothes"

interface CreateCloudinaryImg {
  designName: string
  image: FormData | File
  collectionName: string
}

export const createCloudinaryImg = async ({
  designName,
  image,
  collectionName
}: CreateCloudinaryImg) => {
  if (image instanceof FormData && image.has("image")) {
    const slug = createSlugForClothes(designName)
    const imagesFormData = image.get("image") as File

    const byte = await imagesFormData.arrayBuffer()
    const buffer = Buffer.from(byte)

    const cloudinaryResponse = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `Rise-Stock/clothes/${collectionName}`,
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

    return cloudinaryResponse
  }
  return undefined
}
