def to_celsius(f):
    return round((f - 32) * 5 / 9, 1)

def is_monsoon(month):
    if 6 <= month <= 9:
        return 1
    return 0

def chai_cost(cups, price):
    if cups >= 10:
        return cups * price * 0.9
    return cups * price
