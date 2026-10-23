temps = [31, 33, 30, 35]
total = 0
for i in range(1, len(temps)):
    total += temps[i]
print(f"Average: {total / len(temps)}")
