SELECT category, COUNT(*) AS items, ROUND(AVG(price), 1) AS avg_price
FROM products
GROUP BY category
HAVING COUNT(*) >= 3;
