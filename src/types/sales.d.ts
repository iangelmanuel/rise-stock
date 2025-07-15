import type {
  createNewSale,
  getSalesWithAllSchema,
  salesType
} from "@/schemas/sales.schemas"
import type { z } from "zod"

export type CreateNewSaleForm = z.infer<typeof createNewSale>
export type SalesType = z.infer<typeof salesType>
export type GetSalesWithAll = z.infer<typeof getSalesWithAllSchema>

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
