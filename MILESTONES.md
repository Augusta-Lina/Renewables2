# Project Milestones

Key versions of this project, listed newest-first. Use `git checkout <hash>` to return to any milestone.

---

### v4 — Stacking Ensemble (All 5 Targets)
- **Commit:** `2a9db68`
- **Date:** 2026-02-19
- **What:** Added stacking ensemble for wind onshore, load, and residual load (joining existing solar & price). All 5 targets now on dashboard Stacking page. Modified `run_stacking()` to work without PatchTST predictions.
- **Dashboard:** 5 pages — Feature Importance, DeepAR, TFT, PatchTST, Stacking
- **Best results (MAE):**
  - Price: 4.58 EUR/MWh (TSO: 8.87, +48% better)
  - Solar: 203.7 MW (TSO: 141.1)
  - Wind Onshore: 501.3 MW (TSO: 448.1)
  - Residual Load: 650.5 MW (TSO: 589.3)
  - Load: 648.7 MW (TSO: 270.1)

---

### v3 — PatchTST + Stacking Ensemble (Solar & Price)
- **Commit:** `781f03d`
- **Date:** 2026-02-19
- **What:** Added PatchTST transformer model (notebook 06) and stacking ensemble (notebook 07) for solar and price. New dashboard pages for PatchTST and Stacking.
- **Key files:** `notebooks/06_patchtst.ipynb`, `notebooks/07_stacking_ensemble.ipynb`

---

### v2 — DeepAR + TFT Forecasts with XGBoost Correction
- **Commit:** `f6622d6`
- **Date:** 2026-02-18
- **What:** Ran DeepAR notebooks (03_2 through 03_5) for solar, load, residual, price with XGBoost residual correction. Added TFT forecasts (notebooks 04_2 through 04_5). Dashboard pages for DeepAR and TFT.
- **Key files:** `notebooks/03_*.ipynb`, `notebooks/04_*.ipynb`

---

### v1 — Initial Commit
- **Commit:** `46e8953`
- **Date:** 2026-02-17
- **What:** Full project setup. Data cleaning (notebook 01), feature importance (notebook 02), initial load forecast (notebook 03), initial price analysis (notebook 04). Next.js dashboard with Feature Importance page.
- **Key files:** `notebooks/01_clean.ipynb`, `notebooks/02_feature_importance.ipynb`, `dashboard/`
