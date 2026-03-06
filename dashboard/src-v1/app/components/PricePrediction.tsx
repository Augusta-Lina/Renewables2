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
        <h2 className="font-serif text-2xl sm:text-3xl text-bark mb-1">
          Price Prediction by Hour
        </h2>
        <p className="text-bark-light">
          MAE per hour (0-23) — Gradient Boosting vs TSO day-ahead price — test year 2018
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
        <div className="bg-sand-light rounded-lg border-2 border-bark p-3 sm:p-4 text-center flex-1">
          <p className="text-bark-light text-xs sm:text-sm">TSO Overall MAE</p>
          <p className="text-xl sm:text-2xl font-bold text-bark">
            {data.overall.mae_tso}
            <span className="text-xs sm:text-sm text-bark-light ml-1">EUR/MWh</span>
          </p>
        </div>
        <div className="bg-sand-light rounded-lg border-2 border-bark p-3 sm:p-4 text-center flex-1">
          <p className="text-bark-light text-xs sm:text-sm">Our Model Overall MAE</p>
          <p className="text-xl sm:text-2xl font-bold text-bark">
            {data.overall.mae_our_model}
            <span className="text-xs sm:text-sm text-bark-light ml-1">EUR/MWh</span>
          </p>
        </div>
      </div>

      <div className="bg-sand-light rounded-lg border-2 border-bark p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e0cc" />
            <XAxis dataKey="label" tick={{ fill: "#5a5247", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "#5a5247", fontSize: 12 }}
              label={{ value: "MAE (EUR/MWh)", angle: -90, position: "insideLeft", fill: "#5a5247", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#f5ead8", border: "2px solid #4a2518", borderRadius: "8px" }}
              labelStyle={{ color: "#1a1a1a", fontWeight: 600 }}
              formatter={(value) => `${value} EUR/MWh`}
            />
            <Legend wrapperStyle={{ color: "#5a5247" }} />
            <Bar dataKey="mae_tso" fill="#3b82f6" name="TSO Day-Ahead" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mae_our_model" fill="#f59e0b" name="Our Model" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
