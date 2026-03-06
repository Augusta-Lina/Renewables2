import PageShell from "./components/PageShell";
import FeatureImportance from "./components/FeatureImportance";

import featureData from "../../public/data/feature_importance.json";

export default function Home() {
  return (
    <PageShell heroImage="/images/hero.avif">
      <FeatureImportance data={featureData} />
    </PageShell>
  );
}
