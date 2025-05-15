import { z } from "zod"

export const stockVariantsSchema = z.object({
  size: z.enum(["S", "M", "L", "XL"]),
  stock: z
    .number()
    .min(0, {
      message: "Stock must be greater than or equal to 0"
    })
    .max(100, {
      message: "Stock must be less than or equal to 100"
    })
})
