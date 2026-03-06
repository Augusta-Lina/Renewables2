"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type FeatureEntry = { feature: string; importance: number };
type TargetResult = { r2: number; features: FeatureEntry[] };
type FeatureData = {
  demand: TargetResult;
  price: TargetResult;
  wind_onshore: TargetResult;
  residual_load: TargetResult;
};

const COLORS: Record<keyof FeatureData, string> = {
  demand: "#3b82f6",
  price: "#f59e0b",
  wind_onshore: "#10b981",
  residual_load: "#ef4444",
};

const LABELS: Record<keyof FeatureData, string> = {
  demand: "Electricity Demand",
  price: "Electricity Price",
  wind_onshore: "Wind Onshore Generation",
  residual_load: "Residual Load (Backup Gap)",
};

function formatFeatureName(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function Chart({
  data,
  r2,
  color,
  title,
}: {
  data: FeatureEntry[];
  r2: number;
  color: string;
  title: string;
}) {
  const formatted = data.map((d) => ({
    ...d,
    label: formatFeatureName(d.feature),
  }));

  return (
    <div className="bg-sand-light rounded-lg border-2 border-bark p-4 sm:p-6">
      <h3 className="font-serif text-lg sm:text-xl text-bark">{title}</h3>
      <p className="text-sm text-bark-light mb-3">
        R² = {r2} — weather explains {Math.round(r2 * 100)}% of variance
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formatted} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e0cc" />
          <XAxis type="number" tick={{ fill: "#5a5247", fontSize: 11 }} />
          <YAxis
            dataKey="label"
            type="category"
            tick={{ fill: "#5a5247", fontSize: 10 }}
            width={120}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#f5ead8", border: "2px solid #4a2518", borderRadius: "8px" }}
            labelStyle={{ color: "#1a1a1a", fontWeight: 600 }}
            itemStyle={{ color: "#5a5247" }}
          />
          <Bar dataKey="importance" fill={color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function FeatureImportance({ data }: { data: FeatureData }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-bark mb-1">
          Feature Importance
        </h2>
        <p className="text-bark-light">
          Random Forest — top 7 weather features per target (80/20 train/test split)
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {(Object.keys(LABELS) as Array<keyof FeatureData>).map((key) => (
          <Chart
            key={key}
            data={data[key].features}
            r2={data[key].r2}
            color={COLORS[key]}
            title={LABELS[key]}
          />
        ))}
      </div>
    </section>
  );
}
