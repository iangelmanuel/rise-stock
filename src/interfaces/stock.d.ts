import {
  createStockClothesSchema,
  editStockClothesSchema
} from "@/schemas/stock.schemas"
import { z } from "zod"

export type StockVariantsFormData = z.infer<typeof editStockClothesSchema>

export type CreateStockClotheForm = z.infer<typeof createStockClothesSchema> & {
  image: FormData | File[]
}
