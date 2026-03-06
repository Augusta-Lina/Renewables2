import PageShell from "../components/PageShell";
import TFTChart from "../components/TFTChart";

import windData from "../../../public/data/stacking_wind_onshore.json";
import solarData from "../../../public/data/stacking_solar.json";
import loadData from "../../../public/data/stacking_load.json";
import residualData from "../../../public/data/stacking_residual_load.json";
import priceData from "../../../public/data/stacking_price.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
const datasets = [windData, solarData, loadData, residualData, priceData] as any[];

export default function StackingForecasts() {
  return (
    <PageShell heroImage="/images/turbines.avif">
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-bark mb-1">
            Stacking Ensemble — Point Forecasts
          </h2>
          <p className="text-bark-light">
            Per-horizon stacking with 5-fold temporal CV. Four tabular base
            models (XGBoost, LightGBM, Ridge, Random Forest) + TSO fed into a
            Ridge meta-learner. Solar &amp; price also include PatchTST
            predictions as an additional meta-feature.
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
