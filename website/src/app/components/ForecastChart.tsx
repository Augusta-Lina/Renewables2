"use client";

import { useState, useEffect, useMemo } from "react";
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
import DateRangeSelector, {
  getSliceIndices,
  type Range,
} from "./DateRangeSelector";

type ForecastPoint = {
  time: string;
  actual: number;
  predicted: number;
};

type ForecastData = {
  target: string;
  model: string;
  metrics: { mae: number; rmse: number; mape: number };
  forecasts: ForecastPoint[];
};

type Props = {
  dataUrl: string;
  title: string;
  color: string;
  unit: string;
  decimals?: number;
};

function formatTime(time: string, pointCount: number) {
  const d = new Date(time);
  if (pointCount <= 24) {
    return `${d.getHours().toString().padStart(2, "0")}:00`;
  }
  if (pointCount <= 168) {
    return `${d.getDate()}d ${d.getHours().toString().padStart(2, "0")}h`;
  }
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function getTickInterval(pointCount: number) {
  if (pointCount <= 24) return 3; // every 3 hours
  if (pointCount <= 168) return 23; // daily
  if (pointCount <= 720) return 71; // ~every 3 days
  return 359; // ~every 15 days
}

export default function ForecastChart({
  dataUrl,
  title,
  color,
  unit,
  decimals = 0,
}: Props) {
  const [data, setData] = useState<ForecastData | null>(null);
  const [range, setRange] = useState<Range>("week");
  const [periodIndex, setPeriodIndex] = useState(0);

  useEffect(() => {
    fetch(dataUrl)
      .then((r) => r.json())
      .then(setData);
  }, [dataUrl]);

  const slicedData = useMemo(() => {
    if (!data) return [];
    const [start, end] = getSliceIndices(
      range,
      periodIndex,
      data.forecasts.length
    );
    return data.forecasts.slice(start, end);
  }, [data, range, periodIndex]);

  if (!data) {
    return (
      <div className="h-[440px] bg-gray-900/50 rounded-xl animate-pulse" />
    );
  }

  const { mae, rmse, mape } = data.metrics;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
          <div className="flex flex-wrap gap-2 mt-2 text-sm">
            <span className="bg-gray-800 px-3 py-1 rounded-full text-gray-300">
              MAE: {mae.toFixed(decimals)} {unit}
            </span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-gray-300">
              RMSE: {rmse.toFixed(decimals)} {unit}
            </span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-gray-300">
              MAPE: {mape.toFixed(1)}%
            </span>
          </div>
        </div>
        <DateRangeSelector
          totalPoints={data.forecasts.length}
          range={range}
          periodIndex={periodIndex}
          onRangeChange={setRange}
          onPeriodChange={setPeriodIndex}
          startDate={data.forecasts[0]?.time}
        />
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart
          data={slicedData}
          margin={{ left: 10, right: 20, top: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            tickFormatter={(t) => formatTime(t, slicedData.length)}
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            interval={getTickInterval(slicedData.length)}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            tickFormatter={(v: number) =>
              decimals > 0 ? v.toFixed(0) : v.toLocaleString()
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
            formatter={(value: number | undefined, name: string | undefined) => {
              const labels: Record<string, string> = {
                predicted: "Predicted",
                actual: "Actual",
              };
              const n = name ?? "";
              return [
                `${(value ?? 0).toFixed(decimals)} ${unit}`,
                labels[n] || n,
              ];
            }}
          />
          <Legend
            content={() => (
              <div className="flex justify-center gap-6 text-xs text-gray-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-4 h-0.5"
                    style={{ backgroundColor: color }}
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

          <Line
            dataKey="predicted"
            stroke={color}
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
