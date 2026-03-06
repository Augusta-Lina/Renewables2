import Nav from "./Nav";

export default function PageShell({
  heroImage,
  children,
}: {
  heroImage: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand">
      {/* Hero with background image */}
      <div
        className="relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 40%, rgba(240,214,183,0.6) 80%, #f0d6b7 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-6 sm:px-10 py-8 sm:py-10">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-3">
                Spain Electricity Analysis
              </h1>
              <p className="text-base sm:text-lg text-white/80 mb-6">
                Hourly generation, demand, prices &amp; weather data (2015-2018).
                Exploring what drives demand, wind generation, and prices.
              </p>
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-white/70 mb-6">
                <span className="bg-white/15 px-3 py-1 rounded-full">35,056 hours</span>
                <span className="bg-white/15 px-3 py-1 rounded-full">5 cities</span>
                <span className="bg-white/15 px-3 py-1 rounded-full">80 features</span>
                <span className="bg-white/15 px-3 py-1 rounded-full">Train 2015-2017</span>
                <span className="bg-white/15 px-3 py-1 rounded-full">Test 2018</span>
              </div>
              <Nav />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        {children}

        <footer className="text-center text-bark-light text-sm pt-8 pb-4">
          Data: ENTSO-E &amp; Open Weather Map via Kaggle
        </footer>
      </main>
    </div>
  );
}
