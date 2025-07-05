"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

interface FootprintChartProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
}

export function FootprintChart({ data }: FootprintChartProps) {
  const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = { label: item.name };
    return acc;
  }, {} as ChartConfig);

  const totalEmissions = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[300px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            strokeWidth={5}
          >
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
  )
}
