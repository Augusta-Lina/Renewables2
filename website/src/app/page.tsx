import Link from "next/link";

const facts = [
  { value: "35,056", label: "hours" },
  { value: "5", label: "cities" },
  { value: "80", label: "features" },
  { value: "2015–2018", label: "period" },
];

const cards = [
  {
    href: "/features",
    title: "Feature Importance",
    desc: "Which weather measurements and cities influence demand, price, and generation the most?",
    color: "border-blue-500/40",
    accent: "text-blue-400",
  },
  {
    href: "/generation",
    title: "Generation Forecasts",
    desc: "24-hour ahead predictions for solar and wind onshore generation.",
    color: "border-amber-500/40",
    accent: "text-amber-400",
  },
  {
    href: "/demand",
    title: "Demand Forecasts",
    desc: "Total electricity load and residual load (backup gap) predictions.",
    color: "border-red-500/40",
    accent: "text-red-400",
  },
  {
    href: "/price",
    title: "Price Forecasts",
    desc: "Day-ahead electricity price predictions across 2018.",
    color: "border-purple-500/40",
    accent: "text-purple-400",
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Spain Electricity Forecasting
        </h1>
        <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
          Hourly forecasts for generation, demand, and prices using a stacking
          ensemble of XGBoost, LightGBM, Ridge, and Random Forest — trained on
          3 years of Spanish electricity and weather data, tested across all of
          2018.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {facts.map((f) => (
          <div
            key={f.label}
            className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3"
          >
            <span className="text-white font-semibold text-lg">{f.value}</span>
            <span className="text-gray-500 ml-2 text-sm">{f.label}</span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`block bg-gray-900 border ${card.color} rounded-xl p-5 hover:bg-gray-800/70 transition-colors group`}
            >
              <h3
                className={`font-semibold ${card.accent} group-hover:underline`}
              >
                {card.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-200">
          Model Selection
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          We evaluated multiple architectures — gradient boosting, DeepAR, TFT,
          PatchTST, and stacking ensembles. The{" "}
          <strong className="text-gray-300">Stacking Ensemble</strong> achieved
          the lowest MAE across all five targets (solar, wind, load, residual
          load, price) and is shown throughout this site. It combines
          out-of-fold predictions from four base learners with a Ridge
          meta-learner, trained per forecast horizon (24 models total per
          target).
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm text-gray-400 mt-2">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-2 pr-6 text-gray-300">Target</th>
                <th className="text-right py-2 pr-6 text-gray-300">MAE</th>
              </tr>
            </thead>
            <tbody>
              {[
                { target: "Solar", mae: "203.7 MW" },
                { target: "Wind Onshore", mae: "501.3 MW" },
                { target: "Load", mae: "649.0 MW" },
                { target: "Residual Load", mae: "651.0 MW" },
                { target: "Price", mae: "4.58 EUR/MWh" },
              ].map((row) => (
                <tr key={row.target} className="border-b border-gray-800/50">
                  <td className="py-2 pr-6">{row.target}</td>
                  <td className="py-2 pr-6 text-right font-mono">
                    {row.mae}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
