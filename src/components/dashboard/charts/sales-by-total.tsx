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
import { monthOrder } from "@/data/months"
import type { DashboardSale } from "@/types/sales"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

type ChartData = {
  month: string
  total: number
}

type Props = {
  sales: DashboardSale[]
}

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig

export function SalesByTotal({ sales }: Props) {
  const data = sales
    .reduce<ChartData[]>((acc, sale) => {
      const date = new Date(sale.saleDate)
      const month = date.toLocaleDateString("es-CO", { month: "long" })

      const existing = acc.find((d) => d.month === month)
      if (existing) {
        existing.total += sale.total
      } else {
        acc.push({
          month,
          total: sale.total
        })
      }
      return acc
    }, [])
    .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month))

  return (
    <Card className="col-span-1 sm:col-span-2">
      <CardHeader>
        <CardTitle>Summary of Sales by Month</CardTitle>

        <CardDescription>
          This chart provides a detailed overview of monthly sales performance,
          highlighting trends and growth over time.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.charAt(0).toUpperCase() + value.slice(1, 3)
              }
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar
              dataKey="total"
              fill="var(--color-chart-1)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
