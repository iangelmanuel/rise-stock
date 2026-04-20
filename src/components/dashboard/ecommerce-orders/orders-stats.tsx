import { AnimatedStatsGrid } from "@/components/shared/animated-stats-grid"
import { StatsCard } from "@/components/shared/stats-card"
import type { DashboardEcommerceOrder } from "@/types/ecommerce-orders"
import { formatCurrency } from "@/utils/format-currency"
import { CheckCircle, Clock, Package, TrendingUp } from "lucide-react"

type Props = {
  orders: DashboardEcommerceOrder[]
}

export function OrdersStats({ orders }: Props) {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)
  const inProgress = orders.filter((o) =>
    ["PENDING", "PROCESSING", "APPROVED", "SHIPPED"].includes(o.orderStatus)
  ).length
  const delivered = orders.filter((o) => o.orderStatus === "DELIVERED").length

  return (
    <AnimatedStatsGrid>
      <StatsCard
        title="Total Orders"
        value={totalOrders}
        icon={Package}
        description="All e-commerce orders"
      />
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={TrendingUp}
        description="Sum across all orders"
      />
      <StatsCard
        title="In Progress"
        value={inProgress}
        icon={Clock}
        description="Pending · Processing · Shipped"
      />
      <StatsCard
        title="Delivered"
        value={delivered}
        icon={CheckCircle}
        description="Successfully completed"
      />
    </AnimatedStatsGrid>
  )
}
