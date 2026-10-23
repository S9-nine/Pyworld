temps = [31, 33, 30, 35]
total = 0
for i in range(len(temps) - 1):
    total += temps[i]
print(f"Average: {total / (len(temps) - 1)}")
