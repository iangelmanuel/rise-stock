"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import type { GeneralSale } from "@/types/sales"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

type Props = {
  data: GeneralSale[]
}

type ChartData = {
  size: string
  count: number
}

const chartConfig = {
  size: {
    label: "Size",
    color: "var(--chart-1)"
  },
  count: {
    label: "Count",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig

export function SalesBySize({ data }: Props) {
  const chartData = data.reduce<ChartData[]>((acc, sale) => {
    const size = sale.clotheSize

    const existing = acc.find((item) => item.size === size)

    if (existing) {
      existing.count += 1
    } else {
      acc.push({ size, count: 1 })
    }

    return acc
  }, [])

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Sales by Size</CardTitle>

        <CardDescription>
          This chart shows the distribution of sales by clothing size. Hover
          over the chart to see the count for each size.
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />

            <PolarAngleAxis dataKey="size" />

            <PolarGrid />

            <Radar
              dataKey="count"
              fill="var(--color-chart-1)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
