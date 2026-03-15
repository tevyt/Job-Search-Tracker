"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
  RenderableText,
  TooltipValueType,
  type BarShapeProps,
} from "recharts";

interface StatusBarChartProps {
  data: { label: string; count: number; color: string }[];
}

export default function StatusBarChart({ data }: StatusBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: RenderableText | TooltipValueType) => `${value} Applications`}
          contentStyle={{
            backgroundColor: "var(--background)",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
          }}
        />
        <Bar
          dataKey="count"
          radius={[4, 4, 0, 0]}
          shape={(props: BarShapeProps) => {
            const entry = data[props.index];
            return <Rectangle {...props} fill={entry.color} />;
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
