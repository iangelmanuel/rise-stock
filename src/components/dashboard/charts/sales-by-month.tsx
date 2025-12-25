"use client"

import * as React from "react"
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
import { formatDate } from "@/utils/format-date"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

type ChartData = {
  month: string
  sales: number
}

type Props = {
  sales: GeneralSale[]
}

const chartConfig = {
  month: {
    label: "Month"
  },
  sales: {
    label: "Sales",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig

export function SalesByMonth({ sales }: Props) {
  const data = sales
    .reduce<ChartData[]>((acc, sale) => {
      const date = new Date(sale.saleDate)
      const key = date.toISOString().split("T")[0]

      const existing = acc.find((d) => d.month === key)

      if (existing) {
        existing.sales += 1
      } else {
        acc.push({ month: key, sales: 1 })
      }

      return acc
    }, [])
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("sales")

  const total = React.useMemo(
    () => ({
      sales: data.reduce((acc, curr) => acc + curr.sales, 0)
    }),
    [data]
  )

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Sales By Month</CardTitle>

          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>

        <div className="flex">
          {["sales"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>

                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-87.5 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                formatDate(value, {
                  day: "numeric",
                  month: "short",
                  year: "2-digit"
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Area
              dataKey="sales"
              type="natural"
              fill="var(--color-chart-1)"
              fillOpacity={0.4}
              stroke="var(--color-chart-1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
