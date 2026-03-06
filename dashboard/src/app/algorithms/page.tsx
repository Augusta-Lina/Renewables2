import Nav from "../components/Nav";

const algorithms = [
  {
    name: "Stacking Ensemble",
    badge: "Best performer",
    description:
      "The stacking method involved a two-phase process. Four prediction models were trained independently: XGBoost, LightGBM, Ridge Regression and Random Forest. A second-stage model was then used to identify how to combine the different predictions, specifically what weight to give each model. The Stacking Ensemble produced the lowest error across all five targets.",
  },
  {
    name: "DeepAR",
    description:
      "A deep learning algorithm developed by Amazon which uses Long Short-Term Memory (LSTM) networks to produce forecasts for related time series, learning shared patterns. It outputs a full probability distribution at each time step, providing confidence intervals around predictions.",
  },
  {
    name: "Temporal Fusion Transformer",
    description:
      "An architecture which combines LSTM-based recurrent layers with self-attention mechanisms within transformers. It automatically learns which input variables and time steps matter most, making it one of the more interpretable deep learning approaches.",
  },
  {
    name: "PatchTST",
    description:
      "A transformer model which splits the context window into 24-hour patches and processes them as tokens, rather than treating each hour individually. This patching approach makes the model more efficient and better at capturing daily patterns.",
  },
];

export default function Algorithms() {
  return (
    <div className="min-h-screen pt-20">
      <Nav />

      {/* Full-bleed background image */}
      <div
        className="relative min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url(/images/grid.avif)" }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 sm:space-y-12">
          {/* Intro glass card */}
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/15 p-6 sm:p-10">
            <h2 className="font-serif text-2xl sm:text-4xl text-white mb-4 text-center">
              Overview of the Different Algorithms
            </h2>
            <p className="text-white/75 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto">
              The models were trained on three years of weather and generation data from 2015 - 2017. The algorithms were then tested on the results from 2018 and the predictions were plotted against the actual values for this period to give an indication of performance accuracy. During testing four models were run: a stacking ensemble, two transformer variants and an LSTM network. After training the transformer and LSTM models, an XGBoost algorithm was trained on the residuals to capture underlying patterns which may not have been captured by the original model. This significantly improved overall performance. This approach was excluded from the ensemble method as it already included XGBoost within the ensemble.
            </p>
          </div>

          {/* Algorithm cards — glassmorphism grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {algorithms.map((algo) => (
              <div
                key={algo.name}
                className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/15 p-6 sm:p-8 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-serif text-xl sm:text-2xl text-white">
                    {algo.name}
                  </h3>
                  {algo.badge && (
                    <span className="text-xs font-medium bg-emerald-400/20 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-400/30">
                      {algo.badge}
                    </span>
                  )}
                </div>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                  {algo.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-sand text-center text-sand-mid text-sm py-6">
        Data: ENTSO-E &amp; Open Weather Map via Kaggle
      </footer>
    </div>
  );
}
