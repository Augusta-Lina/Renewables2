import Nav from "./components/Nav";
import FeatureImportance from "./components/FeatureImportance";

import featureData from "../../public/data/feature_importance.json";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-4xl font-bold text-white">
            Spain Electricity Analysis
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            Hourly generation, demand, prices &amp; weather data (2015–2018).
            Exploring what drives demand, wind generation, and prices — and
            whether weather + time features alone can beat TSO forecasts.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            <span className="bg-gray-800 px-3 py-1 rounded-full">35,056 hours</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">5 cities</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">80 features</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">Train 2015–2017</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">Test 2018</span>
          </div>
          <Nav />
        </header>

        <hr className="border-gray-800" />

        <FeatureImportance data={featureData} />

        <footer className="text-center text-gray-600 text-sm pt-8 pb-4">
          Data: ENTSO-E &amp; Open Weather Map via Kaggle
        </footer>
      </main>
    </div>
  );
}
