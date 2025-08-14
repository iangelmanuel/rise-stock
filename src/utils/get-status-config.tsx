import type { GeneralSale } from "@/types/sales"
import {
  BadgeCheck,
  Ban,
  Banknote,
  Clock,
  Hamburger,
  MapPinCheck,
  Pause,
  ShieldQuestion,
  Truck
} from "lucide-react"

export const getStatusConfig = (status: GeneralSale["status"]) => {
  switch (status) {
    case "PENDING":
      return {
        fill: "#FBBF24",
        color: "bg-amber-50 dark:bg-amber-600",
        icon: Clock,
        text: "Pending"
      }
    case "COOKING":
      return {
        fill: "#F97316",
        color: "bg-orange-50 dark:bg-orange-500",
        icon: Hamburger,
        text: "Cooking"
      }
    case "READY":
      return {
        fill: "#2563EB",
        color: "bg-blue-50 dark:bg-blue-500",
        icon: BadgeCheck,
        text: "Ready"
      }
    case "SENDING":
      return {
        fill: "#3B82F6",
        color: "bg-purple-50 dark:bg-purple-500",
        icon: Truck,
        text: "Sending"
      }
    case "PENDING_PAYMENT":
      return {
        fill: "#EC4899",
        color: "bg-pink-50 dark:bg-pink-500",
        icon: Banknote,
        text: "Pending Payment"
      }
    case "COMPLETED":
      return {
        fill: "#34D399",
        color: "bg-emerald-50 dark:bg-emerald-500",
        icon: MapPinCheck,
        text: "Completed"
      }
    case "CANCELLED":
      return {
        fill: "#EF4444",
        color: "bg-red-50 dark:bg-red-500",
        icon: Ban,
        text: "Cancelled"
      }
    case "PAUSED":
      return {
        fill: "#F59E0B",
        color: "bg-gray-50 dark:bg-gray-500",
        icon: Pause,
        text: "Paused"
      }
    default:
      return {
        fill: "#34D399",
        color: "bg-gray-50 dark:bg-gray-900",
        icon: ShieldQuestion,
        text: status
      }
  }
}
