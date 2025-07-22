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
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

type ChartData = {
  month: string
  desktop: number
}

type Props = {
  sales: GeneralSale[]
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig

export function SalesByTotal({ sales }: Props) {
  const data = sales.reduce<ChartData[]>((acc, sale) => {
    const date = new Date(sale.saleDate)
    const month = date.toLocaleDateString("es-CO", { month: "long" })

    const existing = acc.find((d) => d.month === month)
    if (existing) {
      existing.desktop += sale.total
    } else {
      acc.push({
        month,
        desktop: sale.total
      })
    }
    return acc
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary of Sales by Month</CardTitle>

        <CardDescription>
          This chart provides a detailed overview of monthly sales performance,
          highlighting trends and growth over time.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="desktop"
              fill="var(--color-desktop)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
