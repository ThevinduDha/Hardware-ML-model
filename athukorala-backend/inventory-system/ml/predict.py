import joblib
import pandas as pd
import numpy as np
import json

# =========================
# LOAD MODELS
# =========================
clf = joblib.load("ml/restock_classifier.joblib")
reg = joblib.load("ml/restock_regressor.joblib")

# =========================
# LOAD DATA
# =========================
df = pd.read_csv("C:/Users/DELL/Desktop/Project New/Athukorala-Traders-Project/athukorala-backend/inventory-system/ml/sales_data.csv")

# =========================
# FIXES
# =========================

# Convert date FIRST
df["date"] = pd.to_datetime(df["date"])

# Encode category
df["category"] = df["category"].astype("category").cat.codes

# =========================
# PREPROCESSING
# =========================

# Sort
df = df.sort_values(by=["product_id", "date"])

# Lag features
df["lag_1_units_sold"] = df.groupby("product_id")["units_sold"].shift(1)
df["lag_2_units_sold"] = df.groupby("product_id")["units_sold"].shift(2)
df["lag_3_units_sold"] = df.groupby("product_id")["units_sold"].shift(3)

# Rolling
df["rolling_mean_3"] = df.groupby("product_id")["units_sold"].transform(lambda x: x.rolling(3).mean())
df["rolling_std_3"] = df.groupby("product_id")["units_sold"].transform(lambda x: x.rolling(3).std())

# Derived
df["sales_change_1"] = df["units_sold"] - df["lag_1_units_sold"]
df["stock_gap"] = df["current_stock"] - df["reorder_level"]
df["low_stock_flag"] = (df["current_stock"] < df["reorder_level"]).astype(int)
df["stock_sales_ratio"] = df["current_stock"] / (df["units_sold"] + 1)
df["demand_pressure"] = df["units_sold"] / (df["current_stock"] + 1)

# Date features
df["month"] = df["date"].dt.month
df["day_of_week"] = df["date"].dt.dayofweek
df["quarter"] = df["date"].dt.quarter

df["special_day_flag"] = ((df["month"] == 12) | (df["month"] == 1)).astype(int)

# Fill missing
df.fillna(0, inplace=True)

# =========================
# FEATURES
# =========================
feature_columns = [
    "product_id", "category", "unit_price", "current_stock", "reorder_level",
    "units_sold", "is_holiday", "is_weekend", "month", "day_of_week",
    "lag_1_units_sold", "lag_2_units_sold", "lag_3_units_sold",
    "rolling_mean_3", "rolling_std_3", "sales_change_1", "stock_gap",
    "low_stock_flag", "stock_sales_ratio", "demand_pressure",
    "quarter", "special_day_flag"
]

X = df[feature_columns]

# =========================
# PREDICT
# =========================
df["restock"] = clf.predict(X)
df["quantity"] = reg.predict(X)

# =========================
# FINAL OUTPUT
# =========================
latest = df.sort_values("date").groupby("product_id").tail(1)

result = latest[["product_id", "product_name", "restock", "quantity"]]

print(result.to_json(orient="records"))