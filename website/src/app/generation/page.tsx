"use client";

import ForecastChart from "../components/ForecastChart";

export default function GenerationPage() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Generation Forecasts
        </h2>
        <p className="text-gray-400">
          24-hour ahead predictions for renewable generation across 2018
        </p>
      </div>

      <ForecastChart
        dataUrl="/data/solar.json"
        title="Solar Generation"
        color="#f59e0b"
        unit="MW"
      />

      <ForecastChart
        dataUrl="/data/wind_onshore.json"
        title="Wind Onshore Generation"
        color="#10b981"
        unit="MW"
      />
    </div>
  );
}
