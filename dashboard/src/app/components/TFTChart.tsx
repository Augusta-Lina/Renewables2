"use client";

import {
  LineChart,
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
  predicted: number;
  tso?: number;
};

type TFTData = {
  target: string;
  model: string;
  prediction_length_hours: number;
  context_length_hours: number;
  metrics: {
    mae: number;
    rmse: number;
    mape: number;
    tso_mae?: number;
    tso_rmse?: number;
    tso_mape?: number;
    improvement_pct?: number;
  };
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

function formatTime(time: string) {
  const d = new Date(time);
  const day = d.getDate();
  const hour = d.getHours().toString().padStart(2, "0");
  return `${day}d ${hour}h`;
}

export default function TFTChart({ data }: { data: TFTData }) {
  const config = TARGET_CONFIG[data.target] || {
    title: data.target,
    unit: "",
    color: "#10b981",
    decimals: 0,
  };

  const { mae, rmse, mape, tso_mae, tso_rmse } = data.metrics;
  const beatsTso = tso_mae !== undefined && mae < tso_mae;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-200">{config.title}</h3>
        <div className="flex flex-wrap gap-3 mt-2 text-sm">
          <span className="bg-gray-800 px-3 py-1 rounded-full text-gray-300">
            MAE: {mae.toFixed(config.decimals)} {config.unit}
          </span>
          <span className="bg-gray-800 px-3 py-1 rounded-full text-gray-300">
            RMSE: {rmse.toFixed(config.decimals)} {config.unit}
          </span>
          {mape !== undefined && (
            <span className="bg-gray-800 px-3 py-1 rounded-full text-gray-300">
              MAPE: {mape.toFixed(1)}%
            </span>
          )}
          {tso_mae !== undefined && (
            <span
              className={`px-3 py-1 rounded-full ${
                beatsTso
                  ? "bg-emerald-900/50 text-emerald-300"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              TSO MAE: {tso_mae.toFixed(config.decimals)} {config.unit}
              {beatsTso && " \u2014 We win!"}
            </span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart
          data={data.sample_forecast}
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
              const labels: Record<string, string> = {
                predicted: "TFT Predicted",
                actual: "Actual",
                tso: "TSO Forecast",
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
                    className="inline-block w-4 h-0.5"
                    style={{ backgroundColor: config.color }}
                  />
                  TFT Predicted
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-4 h-0.5 border-t border-dashed"
                    style={{ borderColor: "#f3f4f6" }}
                  />
                  Actual
                </span>
                {data.sample_forecast[0]?.tso !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-4 h-0.5 border-t border-dashed"
                      style={{ borderColor: "#6b7280" }}
                    />
                    TSO Forecast
                  </span>
                )}
              </div>
            )}
          />

          <Line
            dataKey="predicted"
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
          {data.sample_forecast[0]?.tso !== undefined && (
            <Line
              dataKey="tso"
              stroke="#6b7280"
              strokeWidth={1}
              dot={false}
              strokeDasharray="6 3"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
