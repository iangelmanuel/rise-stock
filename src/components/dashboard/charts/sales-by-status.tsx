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
import { getStatusConfig } from "@/utils/get-status-config"
import type { Sale } from "@prisma/client"
import { Pie, PieChart } from "recharts"

type ChartData = {
  status: Sale["status"]
  count: number
  fill?: string
}

type Props = {
  sales: GeneralSale[]
}

export const SalesByStatus = ({ sales }: Props) => {
  const data = sales
    .reduce<ChartData[]>((acc, sale) => {
      const status = sale.status

      const existing = acc.find((s) => s.status === status)
      if (existing) {
        existing.count += 1
      } else {
        acc.push({
          status,
          count: 1
        })
      }

      return acc
    }, [])
    .map((item) => ({
      count: item.count,
      status: getStatusConfig(item.status).text,
      fill: getStatusConfig(item.status).fill
    }))

  const chartConfig = {
    pending: {
      label: "Pending",
      color: "var(--chart-1)"
    },
    completed: {
      label: "Completed",
      color: "var(--chart-2)"
    },
    cancelled: {
      label: "Cancelled",
      color: "var(--chart-3)"
    }
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sales by Status</CardTitle>

        <CardDescription>
          This chart shows the distribution of sales by their current status.
          Click on a segment to filter the data.
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
              dataKey="count"
              nameKey="status"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
