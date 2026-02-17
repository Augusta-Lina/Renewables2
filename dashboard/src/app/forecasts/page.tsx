import Nav from "../components/Nav";
import DeepARChart from "../components/DeepARChart";

import windData from "../../../public/data/deepar_wind.json";
import solarData from "../../../public/data/deepar_solar.json";
import loadData from "../../../public/data/deepar_load.json";
import residualData from "../../../public/data/deepar_residual.json";
import priceData from "../../../public/data/deepar_price.json";

const datasets = [windData, solarData, loadData, residualData, priceData];

export default function Forecasts() {
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
              DeepAR Probabilistic Forecasts
            </h2>
            <p className="text-gray-400">
              LSTM encoder–decoder with Gaussian output (mu, sigma). 7-day
              context, 24h ahead. Trained 2015–2017, tested 2018. Confidence
              bands calibrated to 80% coverage.
            </p>
          </div>

          <div className="space-y-10">
            {datasets.map((data) => (
              <div
                key={data.target}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800"
              >
                <DeepARChart data={data} />
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
