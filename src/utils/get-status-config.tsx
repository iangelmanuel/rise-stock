import type { GeneralSale } from "@/types/sales"
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"

export const getStatusConfig = (status: GeneralSale["status"]) => {
  switch (status) {
    case "COMPLETED":
      return {
        color: "bg-emerald-50 dark:bg-emerald-600",
        icon: CheckCircle,
        text: "Completed"
      }
    case "CANCELLED":
      return {
        color: "bg-red-50 dark:bg-red-600",
        icon: XCircle,
        text: "Cancelled"
      }
    case "PENDING":
      return {
        color: "bg-amber-50 dark:bg-amber-600",
        icon: Clock,
        text: "Pending"
      }
    default:
      return {
        color: "bg-gray-50 dark:bg-gray-900",
        icon: AlertCircle,
        text: status
      }
  }
}
