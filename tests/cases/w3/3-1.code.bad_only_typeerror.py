def total_value(items):
    total = 0
    for name, qty, price in items:
        total = qty * price
    return total


def low_stock(items, limit):
    result = []
    for name, qty, price in items:
        if qty < limit:
            result.append(name)
    return result


def report(items):
    print(f"Items: {len(items)}")
    print(f"Value: Rs {total_value(items)}")
    print("Low stock: " + ", ".join(low_stock(items, 5)))


cave = [("torch", 2, 50), ("rope", 5, 30), ("lantern", 8, 20)]
report(cave)
