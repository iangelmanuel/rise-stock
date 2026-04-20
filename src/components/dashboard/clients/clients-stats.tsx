import { AnimatedStatsGrid } from "@/components/shared/animated-stats-grid"
import { StatsCard } from "@/components/shared/stats-card"
import type { DashboardClient } from "@/types/clients"
import { BadgeCheck, ShoppingBag, UserCheck, Users } from "lucide-react"

type Props = {
  clients: DashboardClient[]
}

export function ClientsStats({ clients }: Props) {
  const totalClients = clients.length
  const activeClients = clients.filter((c) => !c.isUserDeleted).length
  const confirmedClients = clients.filter((c) => c.isConfirmed).length
  const totalOrders = clients.reduce((acc, c) => acc + c._count.orders, 0)

  return (
    <AnimatedStatsGrid>
      <StatsCard
        title="Total Clients"
        value={totalClients}
        icon={Users}
        description="All registered clients"
      />
      <StatsCard
        title="Active Clients"
        value={activeClients}
        icon={UserCheck}
        description="Non-deactivated accounts"
      />
      <StatsCard
        title="Confirmed"
        value={confirmedClients}
        icon={BadgeCheck}
        description="Email-verified accounts"
      />
      <StatsCard
        title="Total Orders"
        value={totalOrders}
        icon={ShoppingBag}
        description="Orders across all clients"
      />
    </AnimatedStatsGrid>
  )
}
