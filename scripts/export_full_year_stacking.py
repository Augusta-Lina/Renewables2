"""Re-run stacking ensemble and export full-year test predictions for all 5 targets."""
import pandas as pd
import numpy as np
import json
import os
import warnings
warnings.filterwarnings('ignore')

import xgboost as xgb
import lightgbm as lgb
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor

os.chdir(os.path.dirname(os.path.abspath(__file__)))

df = pd.read_parquet('../cleaned_data.parquet')
df['time'] = pd.to_datetime(df['time'], utc=True)

train_mask = df['time'].dt.year <= 2017
train_end = int(train_mask.sum())
test_start = train_end
context_length = 168
prediction_length = 24

train_window_starts = list(range(context_length, train_end - prediction_length, prediction_length))
test_window_starts = []
for i in range(test_start, len(df) - prediction_length, prediction_length):
    if i - context_length >= 0:
        test_window_starts.append(i)

print(f'Train windows: {len(train_window_starts)}, Test windows: {len(test_window_starts)}')

# Load PatchTST predictions
pt_solar_train = pd.read_csv('../notebooks/patchtst_solar_train_predictions.csv')
pt_solar_test = pd.read_csv('../notebooks/patchtst_solar_predictions.csv')
pt_price_train = pd.read_csv('../notebooks/patchtst_price_train_predictions.csv')
pt_price_test = pd.read_csv('../notebooks/patchtst_price_predictions.csv')


def extract_tabular_features(df, target_col, weather_cols, window_start, h):
    target_idx = window_start + h
    weather = df[weather_cols].iloc[target_idx].values.astype(float)
    t = df['time'].iloc[target_idx]
    time_feats = np.array([t.hour, t.month, t.dayofweek, int(t.dayofweek >= 5)], dtype=float)
    start_168 = max(0, target_idx - 168)
    start_24 = max(0, target_idx - 24)
    ctx_168 = df[target_col].iloc[start_168:target_idx].values.astype(float)
    ctx_24 = df[target_col].iloc[start_24:target_idx].values.astype(float)
    if len(ctx_24) == 0: ctx_24 = np.array([0.0])
    if len(ctx_168) == 0: ctx_168 = np.array([0.0])
    stats = np.array([
        np.mean(ctx_24), np.std(ctx_24), np.min(ctx_24), np.max(ctx_24),
        np.mean(ctx_168), np.std(ctx_168), np.min(ctx_168), np.max(ctx_168),
        ctx_168[-1],
    ])
    return np.concatenate([weather, time_feats, stats])


def get_base_models():
    return {
        'xgb': xgb.XGBRegressor(n_estimators=200, max_depth=4, learning_rate=0.1, random_state=42, verbosity=0, tree_method='hist'),
        'lgbm': lgb.LGBMRegressor(n_estimators=200, max_depth=4, learning_rate=0.1, random_state=42, verbose=-1),
        'ridge': Ridge(alpha=1.0),
        'rf': RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42, n_jobs=-1),
    }


def run_stacking(df, target_col, tso_col, weather_cols,
                 train_ws, test_ws, pt_train_df=None, pt_test_df=None,
                 prediction_length=24, n_folds=5, clip_min=None):
    n_train = len(train_ws)
    n_test = len(test_ws)
    all_preds = np.zeros((n_test, prediction_length))
    all_actuals = np.zeros((n_test, prediction_length))

    use_patchtst = pt_train_df is not None and pt_test_df is not None
    if use_patchtst:
        pt_train_idx = pt_train_df.set_index(['window', 'horizon'])['patchtst_pred']
        pt_test_idx = pt_test_df.set_index(['window', 'horizon'])['patchtst_pred']

    model_names = list(get_base_models().keys())

    for h in range(prediction_length):
        X_train = np.array([extract_tabular_features(df, target_col, weather_cols, ws, h) for ws in train_ws])
        y_train = np.array([df[target_col].iloc[ws + h] for ws in train_ws])
        tso_train = np.array([df[tso_col].iloc[ws + h] for ws in train_ws])

        X_test = np.array([extract_tabular_features(df, target_col, weather_cols, ws, h) for ws in test_ws])
        y_test = np.array([df[target_col].iloc[ws + h] for ws in test_ws])
        tso_test = np.array([df[tso_col].iloc[ws + h] for ws in test_ws])

        if use_patchtst:
            pt_train = np.array([pt_train_idx.loc[(w, h)] for w in range(n_train)])
            pt_test = np.array([pt_test_idx.loc[(w, h)] for w in range(n_test)])

        fold_size = n_train // n_folds
        oof_preds = {name: np.zeros(n_train) for name in model_names}

        for fold in range(n_folds):
            val_start = fold * fold_size
            val_end = (fold + 1) * fold_size if fold < n_folds - 1 else n_train
            train_idx = list(range(val_start)) + list(range(val_end, n_train))
            val_idx = list(range(val_start, val_end))
            for name in model_names:
                m = get_base_models()[name]
                m.fit(X_train[train_idx], y_train[train_idx])
                oof_preds[name][val_idx] = m.predict(X_train[val_idx])

        meta_cols = [oof_preds[n] for n in model_names] + [tso_train]
        if use_patchtst:
            meta_cols.append(pt_train)
        meta_train = np.column_stack(meta_cols)
        meta = Ridge(alpha=1.0)
        meta.fit(meta_train, y_train)

        test_base_preds = {}
        for name in model_names:
            m = get_base_models()[name]
            m.fit(X_train, y_train)
            test_base_preds[name] = m.predict(X_test)

        test_meta_cols = [test_base_preds[n] for n in model_names] + [tso_test]
        if use_patchtst:
            test_meta_cols.append(pt_test)
        meta_test = np.column_stack(test_meta_cols)
        final_pred = meta.predict(meta_test)

        if clip_min is not None:
            final_pred = np.clip(final_pred, clip_min, None)

        all_preds[:, h] = final_pred
        all_actuals[:, h] = y_test

        if (h + 1) % 6 == 0:
            print(f'  Horizon {h+1}/{prediction_length} done')

    return all_preds, all_actuals


def export_full_year(target_name, preds, actuals, metrics, test_ws, df, prediction_length):
    """Export ALL test windows (full year) to JSON."""
    data = []
    for w in range(len(test_ws)):
        ws = test_ws[w]
        for h in range(prediction_length):
            t = df['time'].iloc[ws + h]
            data.append({
                'time': t.strftime('%Y-%m-%d %H:%M'),
                'actual': round(float(actuals[w, h]), 2),
                'predicted': round(float(preds[w, h]), 2),
            })

    output = {
        'target': target_name,
        'model': 'Stacking Ensemble',
        'metrics': metrics,
        'data': data,
    }

    out_path = f'../dashboard/public/data/full_{target_name}.json'
    with open(out_path, 'w') as f:
        json.dump(output, f)
    print(f'  Saved {out_path} ({len(data)} points)')
    return output


# ---- TARGETS ----

targets = [
    {
        'name': 'wind_onshore',
        'col': 'generation wind onshore',
        'tso': 'forecast wind onshore day ahead',
        'weather': ['wind_speed_madrid', 'wind_speed_bilbao', 'wind_speed_barcelona',
                    'wind_speed_seville', 'wind_speed_valencia',
                    'wind_deg_madrid', 'wind_deg_bilbao', 'wind_deg_barcelona',
                    'wind_deg_seville', 'wind_deg_valencia',
                    'pressure_madrid', 'pressure_bilbao', 'pressure_barcelona',
                    'pressure_seville', 'pressure_valencia',
                    'temp_madrid', 'temp_bilbao', 'temp_barcelona',
                    'temp_seville', 'temp_valencia',
                    'humidity_madrid', 'humidity_bilbao', 'humidity_barcelona',
                    'humidity_seville', 'humidity_valencia'],
        'clip': 0,
        'pt_train': None, 'pt_test': None,
        'unit': 'MW', 'decimals': 0,
    },
    {
        'name': 'solar',
        'col': 'generation solar',
        'tso': 'forecast solar day ahead',
        'weather': ['clouds_all_madrid', 'clouds_all_bilbao', 'clouds_all_barcelona',
                    'clouds_all_seville', 'clouds_all_valencia',
                    'temp_madrid', 'temp_bilbao', 'temp_barcelona',
                    'temp_seville', 'temp_valencia',
                    'temp_max_madrid', 'temp_max_bilbao', 'temp_max_barcelona',
                    'temp_max_seville', 'temp_max_valencia',
                    'humidity_madrid', 'humidity_bilbao', 'humidity_barcelona',
                    'humidity_seville', 'humidity_valencia'],
        'clip': 0,
        'pt_train': pt_solar_train, 'pt_test': pt_solar_test,
        'unit': 'MW', 'decimals': 0,
    },
    {
        'name': 'load',
        'col': 'total load actual',
        'tso': 'total load forecast',
        'weather': ['temp_madrid', 'temp_bilbao', 'temp_barcelona',
                    'temp_seville', 'temp_valencia',
                    'temp_max_madrid', 'temp_max_bilbao', 'temp_max_barcelona',
                    'temp_max_seville', 'temp_max_valencia',
                    'temp_min_madrid', 'temp_min_bilbao', 'temp_min_barcelona',
                    'temp_min_seville', 'temp_min_valencia',
                    'humidity_madrid', 'humidity_bilbao', 'humidity_barcelona',
                    'humidity_seville', 'humidity_valencia',
                    'pressure_madrid', 'pressure_bilbao', 'pressure_barcelona',
                    'pressure_seville', 'pressure_valencia',
                    'wind_speed_madrid', 'wind_speed_bilbao', 'wind_speed_barcelona',
                    'wind_speed_seville', 'wind_speed_valencia'],
        'clip': None,
        'pt_train': None, 'pt_test': None,
        'unit': 'MW', 'decimals': 0,
    },
    {
        'name': 'price',
        'col': 'price actual',
        'tso': 'price day ahead',
        'weather': ['pressure_madrid', 'pressure_bilbao', 'pressure_barcelona',
                    'pressure_seville', 'pressure_valencia',
                    'temp_madrid', 'temp_bilbao', 'temp_barcelona',
                    'temp_seville', 'temp_valencia',
                    'temp_max_madrid', 'temp_max_bilbao', 'temp_max_barcelona',
                    'temp_max_seville', 'temp_max_valencia',
                    'temp_min_madrid', 'temp_min_bilbao', 'temp_min_barcelona',
                    'temp_min_seville', 'temp_min_valencia',
                    'humidity_madrid', 'humidity_bilbao', 'humidity_barcelona',
                    'humidity_seville', 'humidity_valencia',
                    'wind_speed_madrid', 'wind_speed_bilbao', 'wind_speed_barcelona',
                    'wind_speed_seville', 'wind_speed_valencia'],
        'clip': None,
        'pt_train': pt_price_train, 'pt_test': pt_price_test,
        'unit': 'EUR/MWh', 'decimals': 2,
    },
]

# Residual load needs derived columns
df['residual_load'] = df['total load actual'] - df['generation solar'] - df['generation wind onshore']
df['residual_load_tso'] = df['total load forecast'] - df['forecast solar day ahead'] - df['forecast wind onshore day ahead']

targets.append({
    'name': 'residual_load',
    'col': 'residual_load',
    'tso': 'residual_load_tso',
    'weather': ['temp_madrid', 'temp_bilbao', 'temp_barcelona',
                'temp_seville', 'temp_valencia',
                'temp_max_madrid', 'temp_max_bilbao', 'temp_max_barcelona',
                'temp_max_seville', 'temp_max_valencia',
                'humidity_madrid', 'humidity_bilbao', 'humidity_barcelona',
                'humidity_seville', 'humidity_valencia',
                'pressure_madrid', 'pressure_bilbao', 'pressure_barcelona',
                'pressure_seville', 'pressure_valencia',
                'wind_speed_madrid', 'wind_speed_bilbao', 'wind_speed_barcelona',
                'wind_speed_seville', 'wind_speed_valencia',
                'clouds_all_madrid', 'clouds_all_bilbao', 'clouds_all_barcelona',
                'clouds_all_seville', 'clouds_all_valencia'],
    'clip': None,
    'pt_train': None, 'pt_test': None,
    'unit': 'MW', 'decimals': 0,
})

for t in targets:
    print(f'\n=== {t["name"].upper()} ===')
    preds, actuals = run_stacking(
        df, t['col'], t['tso'], t['weather'],
        train_window_starts, test_window_starts,
        t['pt_train'], t['pt_test'],
        clip_min=t['clip'],
    )

    flat_p = preds.flatten()
    flat_a = actuals.flatten()
    mae = float(np.mean(np.abs(flat_a - flat_p)))
    rmse = float(np.sqrt(np.mean((flat_a - flat_p) ** 2)))
    mape = float(np.mean(np.abs((flat_a - flat_p) / np.clip(np.abs(flat_a), 1, None))) * 100)

    d = t['decimals']
    metrics = {
        'mae': round(mae, d),
        'rmse': round(rmse, d),
        'mape': round(mape, 1),
    }
    print(f'  MAE: {metrics["mae"]} {t["unit"]}  |  RMSE: {metrics["rmse"]}  |  MAPE: {metrics["mape"]}%')

    export_full_year(t['name'], preds, actuals, metrics, test_window_starts, df, prediction_length)

print('\nDone!')
