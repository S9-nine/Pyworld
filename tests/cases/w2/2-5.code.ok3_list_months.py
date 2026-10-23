def to_celsius(f):
    return round((f - 32) / 1.8, 1)

def is_monsoon(month):
    return month in [6, 7, 8, 9]

def chai_cost(cups, price):
    if cups >= 10:
        return cups * price * 0.9
    else:
        return cups * price
