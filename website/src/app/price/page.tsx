"use client";

import ForecastChart from "../components/ForecastChart";

export default function PricePage() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Price Forecasts
        </h2>
        <p className="text-gray-400">
          Day-ahead electricity price predictions across 2018
        </p>
      </div>

      <ForecastChart
        dataUrl="/data/price.json"
        title="Electricity Price"
        color="#a855f7"
        unit="EUR/MWh"
        decimals={2}
      />
    </div>
  );
}
