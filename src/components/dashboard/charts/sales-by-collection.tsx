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
import { Pie, PieChart } from "recharts"

type ChartData = {
  collection: string
  count: number
  fill?: string
}

type Props = {
  sales: GeneralSale[]
}

const colorVariables = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)"
]

export const SalesByCollection = ({ sales }: Props) => {
  const data = sales.reduce<ChartData[]>((acc, sale) => {
    const collection = sale.clothe.collection?.name ?? "Unknown"

    const existing = acc.find((s) => s.collection === collection)

    if (existing) {
      existing.count += 1
    } else {
      acc.push({ collection, count: 1 })
    }

    return acc
  }, [])

  data.forEach((item, i) => {
    item.fill = colorVariables[i % colorVariables.length]
  })

  const toChartConfig = (data: ChartData[]) => {
    const chartConfig: Record<string, { label: string; color?: string }> =
      {} satisfies ChartConfig

    data.forEach((item, index) => {
      chartConfig[item.collection] = {
        label:
          item.collection.charAt(0).toUpperCase() + item.collection.slice(1),
        color: item.fill ?? colorVariables[index]
      }
    })

    return chartConfig
  }

  const chartConfig = toChartConfig(data)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sales By Collection</CardTitle>

        <CardDescription>
          This chart visualizes the distribution of sales across different
          clothing collections, helping you identify your most popular styles.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Pie
              data={data}
              nameKey="collection"
              dataKey="count"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
