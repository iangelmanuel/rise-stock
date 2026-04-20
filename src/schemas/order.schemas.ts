import { z } from "zod"

export const orderItemInputSchema = z.object({
  clothesId: z.uuid("Invalid clothes ID"),
  size: z.enum(["S", "M", "L", "XL"], { error: "Size must be S, M, L or XL" }),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Minimum quantity is 1")
    .max(50, "Maximum quantity per item is 50")
})

export const addressInputSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  city: z.string().min(1, "City is required"),
  typeOfIdentification: z.string().min(1, "Type of identification is required"),
  identification: z.string().min(1, "Identification is required"),
  phone: z.string().min(7).max(20),
  address: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  department: z.string().min(1, "Department is required"),
  additionalData: z.string().optional()
})

export const createOrderSchema = z
  .object({
    items: z.array(orderItemInputSchema).min(1, "At least one item is required"),
    savedAddressId: z.uuid("Invalid address ID").optional(),
    address: addressInputSchema.optional(),
    discountCode: z.string().optional(),
    delivery: z.number().min(0).default(0)
  })
  .refine((d) => d.savedAddressId ?? d.address, {
    message: "Either savedAddressId or address data is required",
    path: ["address"]
  })

export const createAddressSchema = addressInputSchema.extend({
  isDefault: z.boolean().default(false)
})

export const updateAddressSchema = addressInputSchema
  .extend({ isDefault: z.boolean().optional() })
  .partial()
