import PageShell from "../components/PageShell";
import TFTChart from "../components/TFTChart";

import solarData from "../../../public/data/patchtst_solar.json";
import priceData from "../../../public/data/patchtst_price.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
const datasets = [solarData, priceData] as any[];

export default function PatchTSTForecasts() {
  return (
    <PageShell heroImage="/images/grid.avif">
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-bark mb-1">
            PatchTST — Point Forecasts
          </h2>
          <p className="text-bark-light">
            Multivariate Patch Time Series Transformer. Context (168h) split
            into 7 patches of 24h, future weather as 8th token. Transformer
            encoder (2 layers, d=64, 4 heads) + XGBoost residual correction.
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
