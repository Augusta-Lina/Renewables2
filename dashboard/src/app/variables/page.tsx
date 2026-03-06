import Nav from "../components/Nav";
import FeatureImportance from "../components/FeatureImportance";

import featureData from "../../../public/data/feature_importance.json";

export default function Variables() {
  return (
    <div className="min-h-screen pt-20">
      <Nav />

      {/* Hero — full-bleed image with glassmorphism intro */}
      <div
        className="relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url(/images/turbines.avif)" }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/15 px-6 sm:px-10 py-8 sm:py-10">
            <h2 className="font-serif text-2xl sm:text-4xl text-white mb-4 text-center">
              Which Weather Variables Matter Most?
            </h2>
            <div className="text-white/75 leading-relaxed space-y-3 text-sm sm:text-base max-w-3xl mx-auto">
              <p>
                To understand which weather variables most influence each target, we trained a Random Forest model on the full set of weather features from all five cities and extracted permutation-based feature importances. On the vertical axis are the weather variables by city. On the horizontal axis is the percentage of variation in the target explained by each variable.
              </p>
              <p>
                Here we can see that the humidity in Valencia, Bilbao and Seville have a significant impact on overall electricity demand, as does the temperature and wind degree in Barcelona. Similarly, the wind speed in Madrid and pressure in Bilbao give us the greatest insight into the total onshore wind generation for Spain. This helps us identify which variables to look at when making evaluations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts — dark full-bleed */}
      <div
        className="relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url(/images/solar.avif)" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <FeatureImportance data={featureData} />

          <footer className="text-center text-white/40 text-sm pt-10 pb-4">
            Data: ENTSO-E &amp; Open Weather Map via Kaggle
          </footer>
        </div>
      </div>
    </div>
  );
}
