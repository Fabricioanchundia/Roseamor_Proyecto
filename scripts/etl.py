import os
import sqlite3
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_DIR = os.path.join(BASE_DIR, "data")
DB_DIR = os.path.join(BASE_DIR, "database")
EXPORTS_DIR = os.path.join(BASE_DIR, "exports")

ORDERS_CSV = os.path.join(DATA_DIR, "orders.csv")
CUSTOMERS_CSV = os.path.join(DATA_DIR, "customers.csv")
PRODUCTS_CSV = os.path.join(DATA_DIR, "products.csv")
DB_PATH = os.path.join(DB_DIR, "roseamor.db")
SCHEMA_PATH = os.path.join(DB_DIR, "schema.sql")

os.makedirs(EXPORTS_DIR, exist_ok=True)

orders = pd.read_csv(ORDERS_CSV)
customers = pd.read_csv(CUSTOMERS_CSV)
products = pd.read_csv(PRODUCTS_CSV)

print("=== FILAS ORIGINALES ===")
print("orders:", len(orders))
print("customers:", len(customers))
print("products:", len(products))

customers.columns = customers.columns.str.strip()
products.columns = products.columns.str.strip()
orders.columns = orders.columns.str.strip()

customers = customers.drop_duplicates(subset=["customer_id"])
products = products.drop_duplicates(subset=["sku"])
orders = orders.drop_duplicates(subset=["order_id"])

customers["created_at"] = pd.to_datetime(customers["created_at"], errors="coerce")
products["cost"] = pd.to_numeric(products["cost"], errors="coerce")
orders["quantity"] = pd.to_numeric(orders["quantity"], errors="coerce")
orders["unit_price"] = pd.to_numeric(orders["unit_price"], errors="coerce")
orders["order_date"] = pd.to_datetime(orders["order_date"], errors="coerce")

products["active"] = products["active"].astype(str).str.strip().str.lower().map({
    "true": 1,
    "false": 0
})

products["cost"] = products["cost"].abs()

products = products.dropna(subset=["sku", "cost", "active"])
orders = orders.dropna(subset=["order_id", "customer_id", "sku", "quantity", "unit_price", "order_date", "channel"])

orders = orders[orders["quantity"] > 0]
orders = orders[orders["unit_price"] > 0]

orders = orders[orders["customer_id"].isin(customers["customer_id"])]
orders = orders[orders["sku"].isin(products["sku"])]

orders["channel"] = orders["channel"].astype(str).str.strip().str.lower()

orders["sales_amount"] = orders["quantity"] * orders["unit_price"]

orders = orders.merge(
    products[["sku", "category", "cost", "active"]],
    on="sku",
    how="left"
)

orders = orders.merge(
    customers[["customer_id", "name", "country", "segment"]],
    on="customer_id",
    how="left"
)

orders["margin_amount"] = (orders["unit_price"] - orders["cost"]) * orders["quantity"]
orders["year_month"] = orders["order_date"].dt.to_period("M").astype(str)

customers["created_at"] = customers["created_at"].dt.strftime("%Y-%m-%d")
orders["order_date"] = orders["order_date"].dt.strftime("%Y-%m-%d")

conn = sqlite3.connect(DB_PATH)
conn.execute("PRAGMA foreign_keys = ON;")

with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
    schema_sql = f.read()

conn.executescript(schema_sql)

customers.to_sql("dim_customers", conn, if_exists="append", index=False)
products.to_sql("dim_products", conn, if_exists="append", index=False)

fact_sales = orders[[
    "order_id", "customer_id", "sku", "quantity", "unit_price", "order_date", "channel"
]]

fact_sales.to_sql("fact_sales", conn, if_exists="append", index=False)

orders.to_csv(os.path.join(EXPORTS_DIR, "sales_enriched.csv"), index=False)
customers.to_csv(os.path.join(EXPORTS_DIR, "dim_customers.csv"), index=False)
products.to_csv(os.path.join(EXPORTS_DIR, "dim_products.csv"), index=False)
fact_sales.to_csv(os.path.join(EXPORTS_DIR, "fact_sales.csv"), index=False)

print("\n=== FILAS LIMPIAS ===")
print("dim_customers:", len(customers))
print("dim_products:", len(products))
print("fact_sales:", len(fact_sales))

print("\nETL completado correctamente.")
print("Base creada en:", DB_PATH)
print("Exports creados en:", EXPORTS_DIR)

conn.close()