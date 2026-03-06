import Nav from "./components/Nav";
import ForecastExplorer from "./components/ForecastExplorer";

import windData from "../../public/data/full_wind_onshore.json";
import solarData from "../../public/data/full_solar.json";
import loadData from "../../public/data/full_load.json";
import residualData from "../../public/data/full_residual_load.json";
import priceData from "../../public/data/full_price.json";

const datasets = [windData, solarData, loadData, residualData, priceData];

export default function Home() {
  return (
    <div className="min-h-screen pt-20">
      <Nav />

      {/* Hero — full-bleed image with glassmorphism intro */}
      <div
        className="relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url(/images/hero.avif)" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/15 px-6 sm:px-10 py-8 sm:py-10">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-5 text-center">
              Forecasting for Renewable Energy
            </h1>
            <div className="text-white/75 text-sm sm:text-base leading-relaxed space-y-3 max-w-4xl mx-auto">
              <p>
                This demo predicts power generation, load demand and electricity prices for Spain in 2018 using four years&apos; worth of historical weather, generation, price and load data. We forecast five targets on a 24-hour-ahead basis:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Wind onshore generation</li>
                <li>Solar generation</li>
                <li>Load demand</li>
                <li>Residual load</li>
                <li>Day-ahead price</li>
              </ul>
              <p>
                Residual load is calculated as the backup gap between demand and renewable generation. Four forecasting models were evaluated: DeepAR, Temporal Fusion Transformers (TFTs), PatchTST and a Stacking Ensemble. The Stacking Ensemble produced the lowest error across all five targets, and its results are shown below. The Variables page shows which weather measurements most influence each target, and the Algorithms page provides an overview of the models used in the research.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions section — dark full-bleed */}
      <div
        className="relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url(/images/wind.avif)" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl text-white">
            Predictions
          </h2>
          <ForecastExplorer datasets={datasets} />

          <footer className="text-center text-white/40 text-sm pt-8 pb-4">
            Data: ENTSO-E &amp; Open Weather Map via Kaggle
          </footer>
        </div>
      </div>
    </div>
  );
}
