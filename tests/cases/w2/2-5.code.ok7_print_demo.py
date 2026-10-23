def to_celsius(f):
    return round((f - 32) * 5 / 9, 1)

def is_monsoon(month):
    return 6 <= month <= 9

def chai_cost(cups, price):
    total = cups * price
    if cups >= 10:
        return total * 0.9
    return total

print("212F is", to_celsius(212))
print(is_monsoon(7))
print(chai_cost(10, 15))
