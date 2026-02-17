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
    <div>
      <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">
        R² = {r2} — weather explains {Math.round(r2 * 100)}% of variance
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formatted} layout="vertical" margin={{ left: 140, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis
            dataKey="label"
            type="category"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            width={130}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
            labelStyle={{ color: "#f3f4f6" }}
            itemStyle={{ color: "#d1d5db" }}
          />
          <Bar dataKey="importance" fill={color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function FeatureImportance({ data }: { data: FeatureData }) {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Feature Importance
        </h2>
        <p className="text-gray-400">
          Random Forest — top 7 weather features per target (80/20 train/test split)
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
