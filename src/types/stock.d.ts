import type {
  clothesImageSchema,
  createClothesStockSchema,
  createCollectionSchema,
  editClothesInfoSchema,
  editClothesStockSchema
} from "@/schemas/stock.schemas"
import type { z } from "zod"

export type CreateCollectionForm = z.infer<typeof createCollectionSchema>

export type CreateClotheStockForm = z.infer<typeof createClothesStockSchema> & {
  image: FormData | File
}

export type EditClothesInfoForm = z.infer<typeof editClothesInfoSchema> & {
  image: FormData | File
}

export type EditVariantStockForm = z.infer<typeof editClothesStockSchema>

export type ClothesImage = z.infer<typeof clothesImageSchema>
