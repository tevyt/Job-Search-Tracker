"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  type RenderableText,
  type TooltipValueType,
} from "recharts";

interface TimelineChartProps {
  data: { month: string; count: number }[];
}

export default function TimelineChart({ data }: TimelineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: RenderableText | TooltipValueType) =>
            `${value} Applications`
          }
          contentStyle={{
            backgroundColor: "var(--background)",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
          }}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
