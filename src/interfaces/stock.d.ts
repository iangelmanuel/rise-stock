import {
  stockVariantsSchema,
  createStockClothesSchema
} from "@/schemas/stock.schemas"
import { z } from "zod"

export type StockVariantsFormData = z.infer<typeof stockVariantsSchema>
export type CreateStockClothes = z.infer<typeof createStockClothesSchema>

export type CreateStockClotheForm = z.infer<typeof createStockClothesSchema> & {
  image: FormData | File[]
}
