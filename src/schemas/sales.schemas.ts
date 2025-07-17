import { z } from "zod"
import { clotheSchema, clothesImageSchema } from "./stock.schemas"
import { userSchema } from "./user.schemas"

export const saleSchema = z.object({
  id: z.string().uuid("Invalid sale ID format"),
  clotheId: z.string().min(1, "Clothes ID is required"),
  clotheSize: z.string().min(1, "Clothes size is required"),
  client: z.string().min(3, "Client name must be at least 3 characters long"),
  note: z
    .string()
    .min(5, "Note must be at least 5 characters long")
    .max(500, "Note cannot exceed 500 characters"),
  state: z.string().min(1, "State is required"),
  city: z.string(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"], {
    errorMap: () => ({ message: "Invalid sale status" })
  }),
  delivery: z.number().min(0, "Delivery cost cannot be negative"),
  total: z
    .number()
    .min(0, "Total amount cannot be negative")
    .max(10000000, "Total amount cannot exceed 10,000,000"),
  saleDate: z.union([
    z.string().datetime({ message: "Invalid date format" }),
    z.date()
  ]),
  userId: z.string().min(1, "User ID is required")
})

export const generalSaleSchema = z.object({
  ...saleSchema.shape,
  clothe: clotheSchema
    .pick({
      id: true,
      design: true,
      color: true,
      price: true,
      collectionId: true,
      createdAt: true
    })
    .extend({
      clothesImage: z.array(clothesImageSchema)
    }),
  user: userSchema.pick({
    id: true,
    name: true
  })
})

export const createNewSale = saleSchema.omit({ id: true })
