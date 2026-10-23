def total_value(items):
    total = 0
    for name, qty, price in items:
        total += price
    return total

def low_stock(items, limit):
    result = []
    for name, qty, price in items:
        if qty <= limit:
            result.append(name)
    return result

def report(items):
    print(f"Items: {len(items)}")
    print(f"Value: Rs {total_value(items)}")
    print("Low stock: " + ", ".join(low_stock(items, 5)))
