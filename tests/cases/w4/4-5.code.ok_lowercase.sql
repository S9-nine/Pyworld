select category, count(*) as items, round(avg(price), 1) as avg_price
from products
group by category
having count(*) >= 3
order by category;
