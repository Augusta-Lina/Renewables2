"use client";

import ForecastChart from "../components/ForecastChart";

export default function DemandPage() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Demand Forecasts
        </h2>
        <p className="text-gray-400">
          Total electricity load and residual load (backup gap) predictions
          across 2018
        </p>
      </div>

      <ForecastChart
        dataUrl="/data/load.json"
        title="Load Demand"
        color="#3b82f6"
        unit="MW"
      />

      <ForecastChart
        dataUrl="/data/residual_load.json"
        title="Residual Load"
        color="#ef4444"
        unit="MW"
      />
    </div>
  );
}
