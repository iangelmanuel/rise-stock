import type { OrderStatus } from "../../generated/prisma/enums"
import {
  Ban,
  BadgeCheck,
  Clock,
  PackageCheck,
  ShieldQuestion,
  Truck,
  Wallet
} from "lucide-react"

export const getOrderStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return {
        fill: "#FBBF24",
        color: "bg-amber-50 dark:bg-amber-600",
        icon: Clock,
        text: "Pending"
      }
    case "PROCESSING":
      return {
        fill: "#F97316",
        color: "bg-orange-50 dark:bg-orange-500",
        icon: PackageCheck,
        text: "Processing"
      }
    case "APPROVED":
      return {
        fill: "#2563EB",
        color: "bg-blue-50 dark:bg-blue-500",
        icon: Wallet,
        text: "Approved"
      }
    case "SHIPPED":
      return {
        fill: "#8B5CF6",
        color: "bg-purple-50 dark:bg-purple-500",
        icon: Truck,
        text: "Shipped"
      }
    case "DELIVERED":
      return {
        fill: "#34D399",
        color: "bg-emerald-50 dark:bg-emerald-500",
        icon: BadgeCheck,
        text: "Delivered"
      }
    case "CANCELLED":
      return {
        fill: "#EF4444",
        color: "bg-red-50 dark:bg-red-500",
        icon: Ban,
        text: "Cancelled"
      }
    default:
      return {
        fill: "#6B7280",
        color: "bg-gray-50 dark:bg-gray-700",
        icon: ShieldQuestion,
        text: status
      }
  }
}

export const orderStatusList = [
  { value: "PENDING" as OrderStatus, label: "Pending" },
  { value: "PROCESSING" as OrderStatus, label: "Processing" },
  { value: "APPROVED" as OrderStatus, label: "Approved" },
  { value: "SHIPPED" as OrderStatus, label: "Shipped" },
  { value: "DELIVERED" as OrderStatus, label: "Delivered" },
  { value: "CANCELLED" as OrderStatus, label: "Cancelled" }
]
