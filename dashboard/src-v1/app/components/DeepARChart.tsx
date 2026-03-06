"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ForecastPoint = {
  time: string;
  actual: number;
  p5: number;
  p10: number;
  p20: number;
  p30: number;
  p40: number;
  p50: number;
  p60: number;
  p70: number;
  p80: number;
  p90: number;
  p95: number;
};

type DeepARData = {
  target: string;
  model: string;
  prediction_length_hours: number;
  context_length_hours: number;
  metrics: {
    mae: number;
    tso_mae?: number;
    coverage_80: number;
    coverage_90?: number;
  };
  quantile_levels: number[];
  sample_forecast: ForecastPoint[];
};

const TARGET_CONFIG: Record<
  string,
  { title: string; unit: string; color: string; decimals: number }
> = {
  wind_onshore: { title: "Wind Onshore Generation", unit: "MW", color: "#10b981", decimals: 0 },
  solar: { title: "Solar Generation", unit: "MW", color: "#f59e0b", decimals: 0 },
  load: { title: "Load Demand", unit: "MW", color: "#3b82f6", decimals: 0 },
  residual_load: { title: "Residual Load (Backup Gap)", unit: "MW", color: "#ef4444", decimals: 0 },
  price: { title: "Electricity Price", unit: "EUR/MWh", color: "#a855f7", decimals: 2 },
};

const BANDS = [
  { lower: "p5", upper: "p95", opacity: 0.1 },
  { lower: "p10", upper: "p90", opacity: 0.15 },
  { lower: "p20", upper: "p80", opacity: 0.22 },
  { lower: "p30", upper: "p70", opacity: 0.3 },
  { lower: "p40", upper: "p60", opacity: 0.4 },
];

function formatTime(time: string) {
  const d = new Date(time);
  return `${d.getDate()}d ${d.getHours().toString().padStart(2, "0")}h`;
}

export default function DeepARChart({ data }: { data: DeepARData }) {
  const config = TARGET_CONFIG[data.target] || {
    title: data.target, unit: "", color: "#10b981", decimals: 0,
  };

  const chartData = data.sample_forecast.map((d) => {
    const point: Record<string, number | string> = {
      time: d.time, actual: d.actual, p50: d.p50,
    };
    BANDS.forEach(({ lower, upper }, i) => {
      const lo = d[lower as keyof ForecastPoint] as number;
      const hi = d[upper as keyof ForecastPoint] as number;
      point[`base_${i}`] = lo;
      point[`band_${i}`] = Math.max(0, hi - lo);
    });
    return point;
  });

  const { mae, tso_mae, coverage_80, coverage_90 } = data.metrics;
  const beatsTso = tso_mae !== undefined && mae < tso_mae;
  const hiddenKeys = new Set(BANDS.flatMap((_, i) => [`base_${i}`, `band_${i}`]));

  return (
    <div className="bg-sand-light rounded-lg border-2 border-bark p-4 sm:p-6 space-y-4">
      <div>
        <h3 className="font-serif text-lg sm:text-xl text-bark">{config.title}</h3>
        <div className="flex flex-wrap gap-2 mt-2 text-xs sm:text-sm">
          <span className="bg-sand-pale px-3 py-1 rounded-full text-bark-light">
            MAE: {mae.toFixed(config.decimals)} {config.unit}
          </span>
          {tso_mae !== undefined && (
            <span
              className={`px-3 py-1 rounded-full ${
                beatsTso
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-sand-pale text-bark-light"
              }`}
            >
              TSO MAE: {tso_mae.toFixed(config.decimals)} {config.unit}
              {beatsTso && " — We win!"}
            </span>
          )}
          <span className="bg-sand-pale px-3 py-1 rounded-full text-bark-light">
            80%: {coverage_80}%{coverage_90 ? ` | 90%: ${coverage_90}%` : ""}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e0cc" />
          <XAxis dataKey="time" tickFormatter={formatTime} tick={{ fill: "#5a5247", fontSize: 11 }} interval={23} />
          <YAxis
            tick={{ fill: "#5a5247", fontSize: 11 }}
            tickFormatter={(v: number) => config.decimals > 0 ? v.toFixed(0) : v.toLocaleString()}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#f5ead8", border: "2px solid #4a2518", borderRadius: "8px" }}
            labelStyle={{ color: "#1a1a1a", fontWeight: 600 }}
            labelFormatter={(label) => {
              const d = new Date(String(label));
              return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
            }}
            formatter={(value, name) => {
              if (hiddenKeys.has(String(name))) return [null, null];
              const labels: Record<string, string> = { p50: "Predicted", actual: "Actual" };
              return [`${Number(value).toFixed(config.decimals)} ${config.unit}`, labels[String(name)] || String(name)];
            }}
          />
          <Legend
            content={() => (
              <div className="flex justify-center gap-4 sm:gap-6 text-xs text-bark-light mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-3 rounded-sm" style={{ backgroundColor: config.color, opacity: 0.3 }} />
                  90% Confidence
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-0.5" style={{ backgroundColor: config.color }} />
                  Predicted
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-0.5 border-t border-dashed" style={{ borderColor: "#4a2518" }} />
                  Actual
                </span>
              </div>
            )}
          />

          {BANDS.map((_, i) => (
            <Area key={`base_${i}`} dataKey={`base_${i}`} stackId={`band_${i}`} fill="transparent" stroke="none" legendType="none" isAnimationActive={false} />
          ))}
          {BANDS.map(({ opacity }, i) => (
            <Area key={`band_${i}`} dataKey={`band_${i}`} stackId={`band_${i}`} fill={config.color} fillOpacity={opacity} stroke="none" legendType="none" isAnimationActive={false} />
          ))}

          <Line dataKey="p50" stroke={config.color} strokeWidth={2} dot={false} />
          <Line dataKey="actual" stroke="#4a2518" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
