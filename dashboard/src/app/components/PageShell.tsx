import Nav from "./Nav";

export default function PageShell({
  heroImage,
  heroContent,
  children,
}: {
  heroImage: string;
  heroContent?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand pt-20">
      <Nav />

      {/* Hero with background image */}
      <div
        className="relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 40%, rgba(236,228,218,0.6) 80%, #ECE4DA 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="w-full">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/15 px-6 sm:px-10 py-8 sm:py-10">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-5 text-center">
                Spain Electricity Forecasting
              </h1>
              {heroContent && (
                <div className="text-white/80 text-sm sm:text-base leading-relaxed">
                  {heroContent}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 sm:space-y-14">
        {children}

        <footer className="text-center text-sand-mid text-sm pt-6 pb-4">
          Data: ENTSO-E &amp; Open Weather Map via Kaggle
        </footer>
      </main>
    </div>
  );
}
