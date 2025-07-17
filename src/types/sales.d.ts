import type {
  createNewSale,
  generalSaleSchema,
  saleSchema
} from "@/schemas/sales.schemas"
import type { z } from "zod"

export type CreateNewSaleForm = z.infer<typeof createNewSale>
export type SalesType = z.infer<typeof saleSchema>
export type GeneralSale = z.infer<typeof generalSaleSchema>

export type GetAllClothes = {
  id: string
  design: string
  color: string
  price: number
}

export type GetAllUsers = {
  id: string
  name: string
}
