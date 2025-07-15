import { z } from "zod"
import { clothesImageSchema } from "./stock.schemas"
import { usersSchema } from "./user.schemas"

export const createNewSale = z.object({
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

export const salesType = createNewSale.extend({
  id: z.string().uuid("Invalid sale ID format")
})

export const getSalesWithAllSchema = z.object({
  ...salesType.shape,
  clothe: z.object({
    id: z.string().uuid("Invalid clothe ID format"),
    createdAt: z.date(),
    design: z.string().min(3, "Design must be at least 3 characters long"),
    color: z.string().min(3, "Color must be at least 3 characters long"),
    price: z
      .number()
      .min(0, "Price cannot be negative")
      .max(1000000, "Price cannot exceed 1,000,000"),
    collectionId: z.string().uuid("Invalid collection ID format").nullable(),
    clothesImage: z.array(clothesImageSchema)
  }),
  user: usersSchema.pick({
    id: true,
    name: true
  })
})
