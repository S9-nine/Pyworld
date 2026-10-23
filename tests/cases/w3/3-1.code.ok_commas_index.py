def total_value(items):
    total = 0
    for item in items:
        total = total + item[1] * item[2]
    return total

def low_stock(items, limit):
    result = []
    for item in items:
        if not item[1] > limit:
            result.append(item[0])
    return result

def report(items):
    print("Items:", len(items))
    print("Value: Rs", total_value(items))
    print("Low stock:", ", ".join(low_stock(items, 5)))

cave = [("torch", 2, 50), ("rope", 5, 30), ("lantern", 8, 20)]
report(cave)
