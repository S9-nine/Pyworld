def to_celsius(f):
    c = (f - 32) * 5 / 9
    c = round(c, 1)
    return c

def is_monsoon(month):
    if 6 <= month <= 9:
        return True
    return False

def chai_cost(cups, price):
    discount = 0
    if cups >= 10:
        discount = 10
    return cups * price * (100 - discount) / 100

print(to_celsius(212), is_monsoon(7), chai_cost(10, 15))
