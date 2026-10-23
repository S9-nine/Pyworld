def to_celsius(f):
    print(round((f - 32) * 5 / 9, 1))

def is_monsoon(month):
    return 6 <= month <= 9

def chai_cost(cups, price):
    return cups * price
