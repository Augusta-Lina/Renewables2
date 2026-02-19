import Nav from "../components/Nav";
import TFTChart from "../components/TFTChart";

import solarData from "../../../public/data/stacking_solar.json";
import priceData from "../../../public/data/stacking_price.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
const datasets = [solarData, priceData] as any[];

export default function StackingForecasts() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold text-white">
            Spain Electricity Analysis
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            Hourly generation, demand, prices &amp; weather data (2015–2018).
          </p>
          <Nav />
        </header>

        <hr className="border-gray-800" />

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Stacking Ensemble — Point Forecasts
            </h2>
            <p className="text-gray-400">
              Per-horizon stacking with 5-fold temporal CV. Four tabular base
              models (XGBoost, LightGBM, Ridge, Random Forest) + TSO + PatchTST
              predictions fed into a Ridge meta-learner.
            </p>
          </div>

          <div className="space-y-10">
            {datasets.map((data) => (
              <div
                key={data.target}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800"
              >
                <TFTChart data={data} />
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center text-gray-600 text-sm pt-8 pb-4">
          Data: ENTSO-E &amp; Open Weather Map via Kaggle
        </footer>
      </main>
    </div>
  );
}
