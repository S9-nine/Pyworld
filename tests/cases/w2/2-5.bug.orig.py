def average(scores):
    total = 0
    for s in scores:
        total += s
    print(total / len(scores))

result = average([80, 90, 70])
print(f"Average: {result}")
