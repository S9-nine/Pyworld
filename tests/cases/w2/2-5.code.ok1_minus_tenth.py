def to_celsius(f):
    return round((f - 32) * 5 / 9, 1)

def is_monsoon(month):
    return month >= 6 and month <= 9

def chai_cost(cups, price):
    total = cups * price
    if cups >= 10:
        total = total - total * 0.1
    return total
