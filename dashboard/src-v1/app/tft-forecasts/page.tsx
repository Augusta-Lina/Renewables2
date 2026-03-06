import PageShell from "../components/PageShell";
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
    <PageShell heroImage="/images/solar.avif">
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-bark mb-1">
            Temporal Fusion Transformer — Point Forecasts
          </h2>
          <p className="text-bark-light">
            Variable selection + gated residual networks + LSTM
            encoder-decoder + interpretable multi-head attention (Lim et al.
            2019). 7-day context, 24h ahead. Trained 2015-2017, tested 2018.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-10">
          {datasets.map((data) => (
            <TFTChart key={data.target} data={data} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
