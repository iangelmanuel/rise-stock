import { stockVariantsSchema } from "@/schemas/stocks.schemas"
import { z } from "zod"

export type StockVariantsFormData = z.infer<typeof stockVariantsSchema>
