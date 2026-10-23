def to_celsius(f):
    return float(int((f - 32) * 5 / 9 + 0.5))

def is_monsoon(month):
    return 6 <= month <= 9

def chai_cost(cups, price):
    if cups >= 10:
        return cups * price * 0.9
    return cups * price
