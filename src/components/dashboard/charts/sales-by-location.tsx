"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import geoJson from "@/data/geo/colombia-departament.json"
import { deptoCodeToName } from "@/data/geo/departament-code"
import type { GeneralSale } from "@/types/sales"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

type HeatData = Record<string, number>

type Props = {
  data: GeneralSale[]
}

const getColor = (value: number) => {
  if (value > 15) return "#1e3a8a"
  if (value > 10) return "#1e40af"
  if (value > 5) return "#1d4ed8"
  if (value > 1) return "#3b82f6"
  if (value > 0) return "#bfdbfe"
  return "#eff6ff"
}

export function SalesByLocation({ data }: Props) {
  const chartData: HeatData = data.reduce((acc, sale) => {
    const dept = sale.state?.trim()

    if (!dept) return acc

    acc[dept] = (acc[dept] ?? 0) + 1

    return acc
  }, {} as HeatData)

  return (
    <Card className="w-full h-auto relative">
      <CardHeader>
        <CardTitle>Sales by Location (Colombia)</CardTitle>

        <CardDescription>
          This heat map shows the number of sales by department in Colombia.
          Hover over a department to see the number of sales.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <TooltipProvider delayDuration={100}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 1500, center: [-74, 4] }}
          >
            <Geographies geography={geoJson}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const code = geo.properties.codigo_departamento_s
                  const deptName = deptoCodeToName[code] ?? ""
                  const value = chartData[deptName] ?? 0

                  return (
                    <Tooltip key={geo.rsmKey}>
                      <TooltipTrigger asChild>
                        <Geography
                          geography={geo}
                          fill={getColor(value)}
                          stroke="#f3f3f3"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          data-department={deptName}
                          data-value={value}
                          data-code={code}
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none", fill: "#ffffff" },
                            pressed: { outline: "none" }
                          }}
                        />
                      </TooltipTrigger>

                      <TooltipContent
                        side="top"
                        className="bg-black border"
                      >
                        <div className="text-sm">
                          <strong>{deptName}</strong>
                          <div>
                            {value} {value === 1 ? "Sale" : "Sales"}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })
              }
            </Geographies>
          </ComposableMap>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
