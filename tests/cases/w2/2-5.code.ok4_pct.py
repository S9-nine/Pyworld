def to_celsius(f):
    return round(5 / 9 * (f - 32), 1)

def is_monsoon(month):
    return month in range(6, 10)

def chai_cost(cups, price):
    total = cups * price
    if cups >= 10:
        total -= total * 10 / 100
    return total
