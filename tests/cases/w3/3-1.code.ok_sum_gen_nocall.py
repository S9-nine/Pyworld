def total_value(items):
    return sum(q * p for n, q, p in items)

def low_stock(items, limit):
    names = []
    for name, qty, price in items:
        if qty < limit or qty == limit:
            names.append(name)
    return names

def report(items):
    low = low_stock(items, 5)
    print(f"Items: {len(items)}")
    print(f"Value: Rs {total_value(items)}")
    print(f"Low stock: {', '.join(low)}")
