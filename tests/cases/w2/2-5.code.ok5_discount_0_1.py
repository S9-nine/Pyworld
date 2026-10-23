def to_celsius(f):
    return round((f - 32) * 5 / 9, 1)

def is_monsoon(month):
    return 6 <= month <= 9

def chai_cost(cups, price):
    total = cups * price
    if cups >= 10:
        discount = total * 0.1
        total = total - discount
    return total
