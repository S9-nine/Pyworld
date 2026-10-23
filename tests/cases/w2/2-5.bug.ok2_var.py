def average(scores):
    total = 0
    for s in scores:
        total += s
    avg = total / len(scores)
    return avg

result = average([80, 90, 70])
print(f"Average: {result}")
