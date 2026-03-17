CREATE TABLE dim_customers (
customer_id TEXT PRIMARY KEY,
name TEXT,
country TEXT,
segment TEXT,
created_at DATE
);

CREATE TABLE dim_products (
sku TEXT PRIMARY KEY,
category TEXT,
cost REAL,
active BOOLEAN
);

CREATE TABLE fact_sales (
order_id TEXT,
customer_id TEXT,
sku TEXT,
quantity INTEGER,
unit_price REAL,
order_date DATE,
channel TEXT,
FOREIGN KEY(customer_id) REFERENCES dim_customers(customer_id),
FOREIGN KEY(sku) REFERENCES dim_products(sku)
);

