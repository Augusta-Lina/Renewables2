"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type HourlyEntry = { hour: number; mae_tso: number; mae_our_model: number };
type PriceData = {
  overall: { mae_tso: number; mae_our_model: number };
  hourly: HourlyEntry[];
};

export default function PricePrediction({ data }: { data: PriceData }) {
  const chartData = data.hourly.map((d) => ({
    ...d,
    label: `${d.hour.toString().padStart(2, "0")}:00`,
  }));

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Price Prediction by Hour
        </h2>
        <p className="text-gray-400">
          MAE per hour (0–23) — Gradient Boosting vs TSO day-ahead price — test year 2018
        </p>
      </div>

      <div className="flex gap-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">TSO Overall MAE</p>
          <p className="text-2xl font-bold text-white">
            {data.overall.mae_tso}
            <span className="text-sm text-gray-400 ml-1">EUR/MWh</span>
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">Our Model Overall MAE</p>
          <p className="text-2xl font-bold text-white">
            {data.overall.mae_our_model}
            <span className="text-sm text-gray-400 ml-1">EUR/MWh</span>
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            label={{
              value: "MAE (EUR/MWh)",
              angle: -90,
              position: "insideLeft",
              fill: "#9ca3af",
              fontSize: 12,
            }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
            labelStyle={{ color: "#f3f4f6" }}
            formatter={(value) => `${value} EUR/MWh`}
          />
          <Legend wrapperStyle={{ color: "#d1d5db" }} />
          <Bar dataKey="mae_tso" fill="#3b82f6" name="TSO Day-Ahead" radius={[4, 4, 0, 0]} />
          <Bar dataKey="mae_our_model" fill="#f59e0b" name="Our Model" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
