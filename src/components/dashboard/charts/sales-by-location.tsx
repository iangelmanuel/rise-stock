"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import geoJson from "@/data/geo/colombia-departament.json"
import { deptoCodeToName } from "@/data/geo/departament-code"
import type { GeneralSale } from "@/types/sales"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

type HeatData = Record<string, number>

type Props = {
  data: GeneralSale[]
}

const getColor = (value: number) => {
  if (value > 20) return "#6B21A8"
  if (value > 10) return "#7E22CE"
  if (value > 5) return "#9333EA"
  if (value > 1) return "#C084FC"
  if (value > 0) return "#E9D5FF"
  return "#FAF5FF"
}

export const ColombiaHeatMap = ({ data }: Props) => {
  const chartData: HeatData = data.reduce((acc, sale) => {
    const dept = sale.state?.trim()
    if (!dept) return acc
    acc[dept] = (acc[dept] ?? 0) + 1
    return acc
  }, {} as HeatData)

  return (
    <Card className="w-full h-auto">
      <CardHeader>
        <CardTitle>Sales by Location (Colombia)</CardTitle>
        <CardDescription>
          This heat map shows the number of sales by department in Colombia.
          Hover over a department to see the number of sales.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getColor(value)}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#A855F7" },
                      pressed: { outline: "none" }
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
      </CardContent>
    </Card>
  )
}
