"use client";

type Range = "day" | "week" | "month" | "year";

type Props = {
  totalPoints: number;
  range: Range;
  periodIndex: number;
  onRangeChange: (range: Range) => void;
  onPeriodChange: (index: number) => void;
  startDate?: string; // first timestamp like "2018-01-01 00:00"
};

const HOURS_PER: Record<Range, number> = {
  day: 24,
  week: 168,
  month: 720, // ~30 days
  year: 8736, // full dataset
};

function getPeriodOptions(
  range: Range,
  totalPoints: number,
  startDate?: string
) {
  if (range === "year") return [{ label: "2018", value: 0 }];

  const hours = HOURS_PER[range];
  const count = Math.ceil(totalPoints / hours);
  const start = startDate ? new Date(startDate) : new Date("2018-01-01");

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start.getTime() + i * hours * 3600_000);
    let label: string;
    if (range === "day") {
      label = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    } else if (range === "week") {
      const end = new Date(d.getTime() + 6 * 86400_000);
      label = `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
    } else {
      label = d.toLocaleDateString("en-GB", { month: "long" });
    }
    return { label, value: i };
  });
}

export function getSliceIndices(
  range: Range,
  periodIndex: number,
  totalPoints: number
): [number, number] {
  if (range === "year") return [0, totalPoints];
  const hours = HOURS_PER[range];
  const start = periodIndex * hours;
  const end = Math.min(start + hours, totalPoints);
  return [start, end];
}

export default function DateRangeSelector({
  totalPoints,
  range,
  periodIndex,
  onRangeChange,
  onPeriodChange,
  startDate,
}: Props) {
  const options = getPeriodOptions(range, totalPoints, startDate);
  const ranges: Range[] = ["day", "week", "month", "year"];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex bg-gray-800 rounded-lg p-0.5">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => {
              onRangeChange(r);
              onPeriodChange(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
              range === r
                ? "bg-gray-600 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {range !== "year" && (
        <select
          value={periodIndex}
          onChange={(e) => onPeriodChange(Number(e.target.value))}
          className="bg-gray-800 text-gray-300 text-xs rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-gray-500"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export type { Range };
