import { readFileSync } from "fs";
import { join } from "path";
import FeatureImportanceChart from "../components/FeatureImportanceChart";

export default function FeaturesPage() {
  const raw = readFileSync(
    join(process.cwd(), "public/data/feature_importance.json"),
    "utf-8"
  );
  const data = JSON.parse(raw);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Feature Importance
        </h2>
        <p className="text-gray-400">
          Random Forest — top 7 weather features per target (80/20 train/test
          split)
        </p>
      </div>
      <FeatureImportanceChart data={data} />
    </div>
  );
}
