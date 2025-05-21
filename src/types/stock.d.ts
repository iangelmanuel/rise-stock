import type {
  createClothesStockSchema,
  editClothesInfoSchema,
  editClothesStockSchema
} from "@/schemas/stock.schemas"
import type { z } from "zod"

export type CreateClotheStockForm = z.infer<typeof createClothesStockSchema> & {
  image: FormData | File
}

export type EditClothesInfoForm = z.infer<typeof editClothesInfoSchema> & {
  image: FormData | File
}

export type EditVariantStockForm = z.infer<typeof editClothesStockSchema>
