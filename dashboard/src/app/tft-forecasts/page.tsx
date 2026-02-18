import Nav from "../components/Nav";
import TFTChart from "../components/TFTChart";

import windData from "../../../public/data/tft_wind.json";
import solarData from "../../../public/data/tft_solar.json";
import loadData from "../../../public/data/tft_load.json";
import residualData from "../../../public/data/tft_residual.json";
import priceData from "../../../public/data/tft_price.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
const datasets = [windData, solarData, loadData, residualData, priceData] as any[];

export default function TFTForecasts() {
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
              Temporal Fusion Transformer — Point Forecasts
            </h2>
            <p className="text-gray-400">
              Variable selection + gated residual networks + LSTM
              encoder–decoder + interpretable multi-head attention (Lim et al.
              2019). 7-day context, 24h ahead. Trained 2015–2017, tested 2018.
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
