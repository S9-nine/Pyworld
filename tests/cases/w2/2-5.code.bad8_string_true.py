def to_celsius(f):
    return round((f - 32) * 5 / 9, 1)

def is_monsoon(month):
    if month >= 6 and month <= 9:
        return "True"
    return "False"

def chai_cost(cups, price):
    if cups >= 10:
        return cups * price * 0.9
    return cups * price
