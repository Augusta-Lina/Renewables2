import PageShell from "../components/PageShell";
import DeepARChart from "../components/DeepARChart";

import windData from "../../../public/data/deepar_wind.json";
import solarData from "../../../public/data/deepar_solar.json";
import loadData from "../../../public/data/deepar_load.json";
import residualData from "../../../public/data/deepar_residual.json";
import priceData from "../../../public/data/deepar_price.json";

const datasets = [windData, solarData, loadData, residualData, priceData];

export default function Forecasts() {
  return (
    <PageShell heroImage="/images/wind.avif">
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-bark mb-1">
            DeepAR Probabilistic Forecasts
          </h2>
          <p className="text-bark-light">
            LSTM encoder-decoder with Gaussian output (mu, sigma). 7-day
            context, 24h ahead. Trained 2015-2017, tested 2018. Confidence
            bands calibrated to 80% coverage.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-10">
          {datasets.map((data) => (
            <DeepARChart key={data.target} data={data} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
