"use client";

import { useState, useMemo } from "react";
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

type DataPoint = { time: string; actual: number; predicted: number };
type TargetData = {
  target: string;
  model: string;
  metrics: { mae: number; rmse: number; mape: number };
  data: DataPoint[];
};

const TARGET_CONFIG: Record<string, { title: string; unit: string; color: string }> = {
  wind_onshore: { title: "Wind Onshore", unit: "MW", color: "#10b981" },
  solar: { title: "Solar", unit: "MW", color: "#f59e0b" },
  load: { title: "Load Demand", unit: "MW", color: "#60a5fa" },
  residual_load: { title: "Residual Load", unit: "MW", color: "#f87171" },
  price: { title: "Price", unit: "EUR/MWh", color: "#c084fc" },
};

const PERIODS = ["Day", "Week", "Month", "Year"] as const;
type Period = (typeof PERIODS)[number];

const PERIOD_HOURS: Record<Period, number> = {
  Day: 24,
  Week: 168,
  Month: 720,
  Year: 8760,
};

function getMonths(data: DataPoint[]) {
  const months = new Set<string>();
  for (const d of data) months.add(d.time.slice(0, 7));
  return Array.from(months).sort();
}

function getDatesForMonth(data: DataPoint[], month: string) {
  const dates = new Set<string>();
  for (const d of data) {
    if (d.time.startsWith(month)) dates.add(d.time.slice(0, 10));
  }
  return Array.from(dates).sort();
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonthLabel(m: string) {
  const [, month] = m.split("-");
  return MONTH_NAMES[parseInt(month, 10) - 1];
}

function TargetChart({
  data, target, period, startDate,
}: {
  data: TargetData; target: string; period: Period; startDate: string;
}) {
  const config = TARGET_CONFIG[target];
  const isPrice = target === "price";

  const sliced = useMemo(() => {
    if (period === "Year") return data.data;
    const startIdx = data.data.findIndex((d) => d.time.startsWith(startDate));
    if (startIdx === -1) return data.data.slice(0, PERIOD_HOURS[period]);
    return data.data.slice(startIdx, startIdx + PERIOD_HOURS[period]);
  }, [data.data, period, startDate]);

  const tickInterval = useMemo(() => {
    if (period === "Day") return 3;
    if (period === "Week") return 23;
    if (period === "Month") return 71;
    return 719;
  }, [period]);

  const formatTick = (time: string) => {
    const d = new Date(time.replace(" ", "T"));
    if (period === "Day") return `${d.getHours().toString().padStart(2, "0")}:00`;
    if (period === "Week") return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
    if (period === "Month") return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
    return MONTH_NAMES[d.getMonth()];
  };

  return (
    <div className="bg-white/6 backdrop-blur-xl rounded-2xl border border-white/12 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
        <h3 className="font-serif text-lg sm:text-xl text-white">{config.title}</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-white/10 px-3 py-1 rounded-full text-white/60">
            MAE: {data.metrics.mae} {config.unit}
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-full text-white/60">
            RMSE: {data.metrics.rmse} {config.unit}
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-full text-white/60">
            MAPE: {data.metrics.mape}%
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={sliced} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="time" tickFormatter={formatTick} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} interval={tickInterval} />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
            tickFormatter={(v: number) => isPrice ? `${v.toFixed(0)}` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
            width={45}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(17,7,2,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", backdropFilter: "blur(12px)" }}
            labelStyle={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}
            labelFormatter={(label) => {
              const d = new Date(String(label).replace(" ", "T"));
              return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
            }}
            formatter={(value, name) => {
              const v = Number(value);
              return [
                `${isPrice ? v.toFixed(2) : Math.round(v).toLocaleString()} ${config.unit}`,
                String(name) === "predicted" ? "Predicted" : "Actual",
              ];
            }}
            itemStyle={{ color: "rgba(255,255,255,0.7)" }}
          />
          <Legend
            content={() => (
              <div className="flex justify-center gap-4 text-xs text-white/50 mt-1">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-0.5" style={{ backgroundColor: config.color }} />
                  Predicted
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-0.5 bg-white/60" />
                  Actual
                </span>
              </div>
            )}
          />
          <Line dataKey="predicted" stroke={config.color} strokeWidth={1.5} dot={false} />
          <Line dataKey="actual" stroke="rgba(255,255,255,0.5)" strokeWidth={1} dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ForecastExplorer({ datasets }: { datasets: TargetData[] }) {
  const [period, setPeriod] = useState<Period>("Week");
  const [selectedMonth, setSelectedMonth] = useState("2018-01");
  const [selectedDate, setSelectedDate] = useState("2018-01-01");

  const firstData = datasets[0]?.data || [];
  const months = useMemo(() => getMonths(firstData), [firstData]);
  const dates = useMemo(() => getDatesForMonth(firstData, selectedMonth), [firstData, selectedMonth]);

  const startDate = useMemo(() => {
    if (period === "Year") return "";
    if (period === "Month") return selectedMonth;
    return selectedDate;
  }, [period, selectedMonth, selectedDate]);

  const handleMonthChange = (m: string) => {
    setSelectedMonth(m);
    const newDates = getDatesForMonth(firstData, m);
    if (newDates.length > 0 && !newDates.includes(selectedDate)) setSelectedDate(newDates[0]);
  };

  return (
    <div className="space-y-5">
      {/* Period selector */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-1 bg-white/8 backdrop-blur-xl border border-white/15 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? "bg-white/20 text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/10"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {period !== "Year" && (
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-1.5 text-sm text-white/80 font-medium appearance-none cursor-pointer"
            >
              {months.map((m) => (
                <option key={m} value={m} className="bg-neutral-900 text-white">
                  {formatMonthLabel(m)} 2018
                </option>
              ))}
            </select>

            {(period === "Day" || period === "Week") && (
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-1.5 text-sm text-white/80 font-medium appearance-none cursor-pointer"
              >
                {dates.map((d) => (
                  <option key={d} value={d} className="bg-neutral-900 text-white">
                    {new Date(d + "T00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="space-y-4 sm:space-y-6">
        {datasets.map((ds) => (
          <TargetChart key={ds.target} data={ds} target={ds.target} period={period} startDate={startDate} />
        ))}
      </div>
    </div>
  );
}
