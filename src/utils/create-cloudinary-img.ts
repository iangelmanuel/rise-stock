import type { UploadApiResponse } from "cloudinary"
import { v2 as cloudinary } from "cloudinary"
import { createSlugForClothes } from "./create-slug-for-clothes"

interface CreateCloudinaryImg {
  designName: string
  image: FormData | File
  collectionName: string
}

interface CloudinaryUploadResult {
  publicId: string
  secureUrl: string
}

const uploadSingleImage = async (
  file: File,
  slug: string,
  collectionName: string
): Promise<CloudinaryUploadResult | undefined> => {
  const byte = await file.arrayBuffer()
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

  if (!cloudinaryResponse) return undefined

  return {
    publicId: cloudinaryResponse.public_id,
    secureUrl: cloudinaryResponse.secure_url
  }
}

export const createCloudinaryImg = async ({
  designName,
  image,
  collectionName
}: CreateCloudinaryImg): Promise<CloudinaryUploadResult[] | undefined> => {
  if (image instanceof FormData && image.has("images")) {
    const slug = createSlugForClothes(designName)
    const imagesFormData = image.getAll("images") as File[]

    const uploadPromises = imagesFormData.map((file) =>
      uploadSingleImage(file, slug, collectionName)
    )

    const results = await Promise.all(uploadPromises)

    const successfulUploads = results.filter(
      (result): result is CloudinaryUploadResult => result !== undefined
    )

    return successfulUploads.length > 0 ? successfulUploads : undefined
  }
  return undefined
}
