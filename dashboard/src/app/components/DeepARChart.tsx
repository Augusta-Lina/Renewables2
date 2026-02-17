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
  wind_onshore: {
    title: "Wind Onshore Generation",
    unit: "MW",
    color: "#10b981",
    decimals: 0,
  },
  solar: {
    title: "Solar Generation",
    unit: "MW",
    color: "#f59e0b",
    decimals: 0,
  },
  load: {
    title: "Load Demand",
    unit: "MW",
    color: "#3b82f6",
    decimals: 0,
  },
  residual_load: {
    title: "Residual Load (Backup Gap)",
    unit: "MW",
    color: "#ef4444",
    decimals: 0,
  },
  price: {
    title: "Electricity Price",
    unit: "EUR/MWh",
    color: "#a855f7",
    decimals: 2,
  },
};

// 5 nested bands from outermost (lightest) to innermost (darkest)
const BANDS = [
  { lower: "p5", upper: "p95", opacity: 0.08 },
  { lower: "p10", upper: "p90", opacity: 0.12 },
  { lower: "p20", upper: "p80", opacity: 0.18 },
  { lower: "p30", upper: "p70", opacity: 0.25 },
  { lower: "p40", upper: "p60", opacity: 0.35 },
];

function formatTime(time: string) {
  const d = new Date(time);
  const day = d.getDate();
  const hour = d.getHours().toString().padStart(2, "0");
  return `${day}d ${hour}h`;
}

export default function DeepARChart({ data }: { data: DeepARData }) {
  const config = TARGET_CONFIG[data.target] || {
    title: data.target,
    unit: "",
    color: "#10b981",
    decimals: 0,
  };

  // For each band, compute base (lower quantile) and width (upper - lower)
  // Stacked areas: invisible base + visible band width
  const chartData = data.sample_forecast.map((d) => {
    const point: Record<string, number | string> = {
      time: d.time,
      actual: d.actual,
      p50: d.p50,
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

  // Hide internal band keys from tooltip
  const hiddenKeys = new Set(
    BANDS.flatMap((_, i) => [`base_${i}`, `band_${i}`])
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-200">{config.title}</h3>
        <div className="flex flex-wrap gap-3 mt-2 text-sm">
          <span className="bg-gray-800 px-3 py-1 rounded-full text-gray-300">
            MAE: {mae.toFixed(config.decimals)} {config.unit}
          </span>
          {tso_mae !== undefined && (
            <span
              className={`px-3 py-1 rounded-full ${
                beatsTso
                  ? "bg-emerald-900/50 text-emerald-300"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              TSO MAE: {tso_mae.toFixed(config.decimals)} {config.unit}
              {beatsTso && " — We win!"}
            </span>
          )}
          <span className="bg-gray-800 px-3 py-1 rounded-full text-gray-300">
            80%: {coverage_80}%{coverage_90 ? ` | 90%: ${coverage_90}%` : ""}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart
          data={chartData}
          margin={{ left: 10, right: 20, top: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            tickFormatter={formatTime}
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            interval={23}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            tickFormatter={(v: number) =>
              config.decimals > 0 ? v.toFixed(0) : v.toLocaleString()
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#f3f4f6" }}
            labelFormatter={(label) => {
              const d = new Date(String(label));
              return d.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              });
            }}
            formatter={(value, name) => {
              if (hiddenKeys.has(String(name))) return [null, null];
              const labels: Record<string, string> = {
                p50: "Predicted",
                actual: "Actual",
              };
              return [
                `${Number(value).toFixed(config.decimals)} ${config.unit}`,
                labels[String(name)] || String(name),
              ];
            }}
          />
          <Legend
            content={() => (
              <div className="flex justify-center gap-6 text-xs text-gray-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-4 h-3 rounded-sm"
                    style={{ backgroundColor: config.color, opacity: 0.3 }}
                  />
                  90% Confidence
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-4 h-0.5"
                    style={{ backgroundColor: config.color }}
                  />
                  Predicted
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-4 h-0.5 border-t border-dashed"
                    style={{ borderColor: "#f3f4f6" }}
                  />
                  Actual
                </span>
              </div>
            )}
          />

          {/* Gradient fan: 5 nested bands, outermost lightest → innermost darkest */}
          {BANDS.map(({ opacity }, i) => (
            <Area
              key={`base_${i}`}
              dataKey={`base_${i}`}
              stackId={`band_${i}`}
              fill="transparent"
              stroke="none"
              legendType="none"
              isAnimationActive={false}
            />
          ))}
          {BANDS.map(({ opacity }, i) => (
            <Area
              key={`band_${i}`}
              dataKey={`band_${i}`}
              stackId={`band_${i}`}
              fill={config.color}
              fillOpacity={opacity}
              stroke="none"
              legendType="none"
              isAnimationActive={false}
            />
          ))}

          <Line
            dataKey="p50"
            stroke={config.color}
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="actual"
            stroke="#f3f4f6"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="4 2"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
