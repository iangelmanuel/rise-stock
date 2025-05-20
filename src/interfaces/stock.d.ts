import type {
  createStockClothesSchema,
  editStockClothesSchema
} from "@/schemas/stock.schemas"
import type { z } from "zod"

export type StockVariantsFormData = z.infer<typeof editStockClothesSchema>

export type CreateStockClotheForm = z.infer<typeof createStockClothesSchema> & {
  image: FormData | File[]
}
