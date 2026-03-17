-- 1) Ventas totales
SELECT ROUND(SUM(quantity * unit_price), 2) AS total_sales
FROM fact_sales;

-- 2) Margen total
SELECT ROUND(SUM((f.unit_price - p.cost) * f.quantity), 2) AS total_margin
FROM fact_sales f
JOIN dim_products p ON f.sku = p.sku;

-- 3) Número de pedidos
SELECT COUNT(DISTINCT order_id) AS total_orders
FROM fact_sales;

-- 4) Ticket promedio
SELECT ROUND(SUM(quantity * unit_price) / COUNT(DISTINCT order_id), 2) AS avg_ticket
FROM fact_sales;

-- 5) Ventas por mes
SELECT
    substr(order_date, 1, 7) AS month,
    ROUND(SUM(quantity * unit_price), 2) AS total_sales
FROM fact_sales
GROUP BY substr(order_date, 1, 7)
ORDER BY month;

-- 6) Ventas por canal
SELECT
    channel,
    ROUND(SUM(quantity * unit_price), 2) AS total_sales
FROM fact_sales
GROUP BY channel
ORDER BY total_sales DESC;

-- 7) Margen por categoría
SELECT
    p.category,
    ROUND(SUM((f.unit_price - p.cost) * f.quantity), 2) AS total_margin
FROM fact_sales f
JOIN dim_products p ON f.sku = p.sku
GROUP BY p.category
ORDER BY total_margin DESC;

-- 8) Top 10 clientes por ingresos
SELECT
    c.customer_id,
    c.name,
    ROUND(SUM(f.quantity * f.unit_price), 2) AS total_revenue
FROM fact_sales f
JOIN dim_customers c ON f.customer_id = c.customer_id
GROUP BY c.customer_id, c.name
ORDER BY total_revenue DESC
LIMIT 10;

-- 9) Top 10 productos más vendidos
SELECT
    f.sku,
    p.category,
    SUM(f.quantity) AS total_units_sold
FROM fact_sales f
JOIN dim_products p ON f.sku = p.sku
GROUP BY f.sku, p.category
ORDER BY total_units_sold DESC
LIMIT 10;