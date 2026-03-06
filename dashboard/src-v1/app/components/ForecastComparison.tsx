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
    <div className="bg-sand-light rounded-lg border-2 border-bark p-3 sm:p-4 text-center">
      <p className="text-bark-light text-xs sm:text-sm">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-bark">
        {value.toLocaleString()}
        <span className="text-xs sm:text-sm text-bark-light ml-1">{unit}</span>
      </p>
    </div>
  );
}

export default function ForecastComparison({ data }: { data: ForecastData }) {
  const chartData = data.sample_week.map((d) => ({
    ...d,
    label: d.time.slice(5),
  }));

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-bark mb-1">
          24h Load Forecast vs TSO
        </h2>
        <p className="text-bark-light">
          Gradient Boosting (weather + time features) vs TSO baseline — test year 2018
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <MetricCard label="TSO MAE" value={data.metrics.tso.mae} unit="MW" />
        <MetricCard label="TSO RMSE" value={data.metrics.tso.rmse} unit="MW" />
        <MetricCard label="TSO MAPE" value={data.metrics.tso.mape} unit="%" />
        <MetricCard label="Our MAE" value={data.metrics.our_model.mae} unit="MW" />
        <MetricCard label="Our RMSE" value={data.metrics.our_model.rmse} unit="MW" />
        <MetricCard label="Our MAPE" value={data.metrics.our_model.mape} unit="%" />
      </div>

      <div className="bg-sand-light rounded-lg border-2 border-bark p-4 sm:p-6">
        <h3 className="font-serif text-lg sm:text-xl text-bark mb-3">
          Sample Week (March 5-11, 2018)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e0cc" />
            <XAxis dataKey="label" tick={{ fill: "#5a5247", fontSize: 10 }} interval={23} />
            <YAxis tick={{ fill: "#5a5247", fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#f5ead8", border: "2px solid #4a2518", borderRadius: "8px" }}
              labelStyle={{ color: "#1a1a1a", fontWeight: 600 }}
              formatter={(value) => `${Number(value).toLocaleString()} MW`}
            />
            <Legend wrapperStyle={{ color: "#5a5247" }} />
            <Line type="monotone" dataKey="actual" stroke="#4a2518" strokeWidth={2} dot={false} name="Actual" />
            <Line type="monotone" dataKey="tso_forecast" stroke="#3b82f6" strokeWidth={2} dot={false} name="TSO Forecast" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="our_forecast" stroke="#f59e0b" strokeWidth={2} dot={false} name="Our Model" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
