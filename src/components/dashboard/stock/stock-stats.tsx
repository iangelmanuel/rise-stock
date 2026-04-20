import { AnimatedStatsGrid } from "@/components/shared/animated-stats-grid"
import { StatsCard } from "@/components/shared/stats-card"
import type { Clothes, Collection } from "@prisma/client"
import { Layers, ShirtIcon, ToggleLeft, ToggleRight } from "lucide-react"

type CollectionWithClothes = Collection & { clothes: Pick<Clothes, "id">[] }

type Props = {
  collections: CollectionWithClothes[]
}

export function StockStats({ collections }: Props) {
  const totalCollections = collections.length
  const activeDrops = collections.filter((c) => c.isActive).length
  const inactiveDrops = totalCollections - activeDrops
  const totalClothes = collections.reduce((acc, c) => acc + c.clothes.length, 0)

  return (
    <AnimatedStatsGrid>
      <StatsCard
        title="Total Collections"
        value={totalCollections}
        icon={Layers}
        description="All registered drops"
      />
      <StatsCard
        title="Active Drops"
        value={activeDrops}
        icon={ToggleRight}
        description="Available for new sales"
      />
      <StatsCard
        title="Inactive Drops"
        value={inactiveDrops}
        icon={ToggleLeft}
        description="Disabled drops"
      />
      <StatsCard
        title="Total Clothes"
        value={totalClothes}
        icon={ShirtIcon}
        description="Across all collections"
      />
    </AnimatedStatsGrid>
  )
}
