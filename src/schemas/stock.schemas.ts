import { z } from "zod"

export const collectionSchema = z.object({
  id: z.string().uuid("Invalid collection ID format"),
  name: z
    .string()
    .min(3, "Collection name must be at least 3 characters long")
    .max(50, "Collection name cannot exceed 50 characters"),
  createdAt: z.date()
})

export const clothesImageSchema = z.object({
  id: z.string().uuid("Invalid image ID format"),
  secureUrl: z.string().url("Invalid image URL format"),
  publicId: z.string().min(1, "Public ID is required").nullable()
})

export const clotheSchema = z.object({
  id: z.string().uuid("Invalid clothe ID format"),
  design: z.string().min(3, "Design must be at least 3 characters long"),
  color: z.string().min(3, "Color must be at least 3 characters long"),
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(1000000, "Price cannot exceed 1,000,000"),
  collectionId: z.string().uuid("Invalid collection ID format").nullable(),
  createdAt: z.date()
})

export const clothesVariantSchema = z.object({
  id: z.string().uuid("Invalid variant ID format"),
  size: z.enum(["S", "M", "L", "XL"], {
    required_error: "Size is required"
  }),
  stock: z
    .number()
    .min(0, "Stock must be greater than or equal to 0")
    .max(100, "Stock must be less than or equal to 100"),
  clothesId: clotheSchema.shape.id,
  createdAt: z.date()
})

export const createCollectionSchema = z.object({
  name: collectionSchema.shape.name
})

export const createClothesStockSchema = z.object({
  design: clotheSchema.shape.design,
  color: clotheSchema.shape.color,
  price: clotheSchema.shape.price,
  stock: z.array(clothesVariantSchema.pick({ size: true, stock: true }))
})

export const editClothesInfoSchema = z.object({
  design: createClothesStockSchema.shape.design,
  color: createClothesStockSchema.shape.color,
  price: createClothesStockSchema.shape.price
})

export const editClothesStockSchema = z.object({
  stock: createClothesStockSchema.shape.stock
})
