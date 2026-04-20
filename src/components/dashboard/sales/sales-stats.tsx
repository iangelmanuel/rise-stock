import { AnimatedStatsGrid } from "@/components/shared/animated-stats-grid"
import { StatsCard } from "@/components/shared/stats-card"
import type { DashboardSale } from "@/types/sales"
import { formatCurrency } from "@/utils/format-currency"
import { CheckCircle, Clock, Receipt, TrendingUp } from "lucide-react"

type Props = {
  sales: DashboardSale[]
}

export function SalesStats({ sales }: Props) {
  const totalSales = sales.length
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0)
  const pending = sales.filter((s) => s.status === "PENDING").length
  const completed = sales.filter((s) => s.status === "COMPLETED").length
  const cancelled = sales.filter((s) => s.status === "CANCELLED").length

  return (
    <AnimatedStatsGrid>
      <StatsCard
        title="Total Sales"
        value={totalSales}
        icon={Receipt}
        description="All registered sales"
      />
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={TrendingUp}
        description="Sum of all sales"
      />
      <StatsCard
        title="Pending"
        value={pending}
        icon={Clock}
        description="Awaiting processing"
      />
      <StatsCard
        title="Completed"
        value={completed}
        icon={CheckCircle}
        description={`${cancelled} cancelled`}
      />
    </AnimatedStatsGrid>
  )
}
