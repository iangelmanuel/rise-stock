import type { OrderStatus } from "../../generated/prisma/enums"

export type DashboardEcommerceOrder = {
  id: string
  itemsInOrder: number
  subtotal: number
  tax: number
  delivery: number
  discount: number
  total: number
  orderStatus: OrderStatus
  paidAt: Date | null
  transactionId: string | null
  createdAt: Date
  updatedAt: Date
  clientId: string
  client: {
    id: string
    name: string
    lastname: string
    email: string
    phone: string
  }
  orderItems: {
    id: string
    quantity: number
    size: string
    price: number
    discount: number
    clothes: {
      id: string
      design: string
      color: string
      clothesImage: { id: string; secureUrl: string; publicId: string | null }[]
    }
  }[]
  orderAddress: {
    id: string
    firstName: string
    lastName: string
    city: string
    typeOfIdentification: string
    identification: string
    phone: string
    address: string
    address2: string | null
    postalCode: string
    department: string
    additionalData: string | null
  } | null
  orderTracking: {
    id: string
    company: string
    trackingCode: string
  } | null
  orderDiscount: {
    code: string
    description: string
    discount: number
  } | null
}
