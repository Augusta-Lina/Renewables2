"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Metrics = { mae: number; rmse: number; mape: number };
type TimeseriesPoint = {
  time: string;
  actual: number;
  tso_forecast: number;
  our_forecast: number;
};
type ForecastData = {
  metrics: { tso: Metrics; our_model: Metrics };
  sample_week: TimeseriesPoint[];
};

function MetricCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 text-center">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value.toLocaleString()}
        <span className="text-sm text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  );
}

export default function ForecastComparison({ data }: { data: ForecastData }) {
  const chartData = data.sample_week.map((d) => ({
    ...d,
    label: d.time.slice(5), // "03-05 00:00"
  }));

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          24h Load Forecast vs TSO
        </h2>
        <p className="text-gray-400">
          Gradient Boosting (weather + time features) vs TSO baseline — test year 2018
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="TSO MAE" value={data.metrics.tso.mae} unit="MW" />
        <MetricCard label="TSO RMSE" value={data.metrics.tso.rmse} unit="MW" />
        <MetricCard label="TSO MAPE" value={data.metrics.tso.mape} unit="%" />
        <MetricCard label="Our MAE" value={data.metrics.our_model.mae} unit="MW" />
        <MetricCard label="Our RMSE" value={data.metrics.our_model.rmse} unit="MW" />
        <MetricCard label="Our MAPE" value={data.metrics.our_model.mape} unit="%" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">
          Sample Week (March 5–11, 2018)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="label"
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              interval={23}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
              labelStyle={{ color: "#f3f4f6" }}
              formatter={(value) => `${Number(value).toLocaleString()} MW`}
            />
            <Legend wrapperStyle={{ color: "#d1d5db" }} />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#f3f4f6"
              strokeWidth={2}
              dot={false}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="tso_forecast"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="TSO Forecast"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="our_forecast"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="Our Model"
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
