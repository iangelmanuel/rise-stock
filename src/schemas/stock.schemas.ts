import { z } from "zod"

export const createStockClothesSchema = z.object({
  design: z
    .string()
    .min(3, { message: "Minimum length is 3 characters" })
    .max(20, { message: "Maximum length is 20 characters" }),
  color: z
    .string()
    .min(3, { message: "Minimum length is 3 characters" })
    .max(20, { message: "Maximum length is 20 characters" }),
  price: z
    .number()
    .min(0, { message: "Minimum value is 0" })
    .max(1000000, { message: "Maximum value is 1000000" }),
  stock: z.array(
    z.object({
      size: z.enum(["S", "M", "L", "XL"], {
        required_error: "Size is required"
      }),
      stock: z
        .number()
        .min(0, { message: "Stock must be greater than or equal to 0" })
        .max(100, { message: "Stock must be less than or equal to 100" })
    })
  )
})

export const editStockClothesSchema = z.object({
  stock: createStockClothesSchema.shape.stock
})
