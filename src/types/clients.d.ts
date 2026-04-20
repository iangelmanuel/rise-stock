export type DashboardClient = {
  id: string
  name: string
  lastname: string
  email: string
  phone: string
  isConfirmed: boolean
  isUserDeleted: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    orders: number
  }
}
