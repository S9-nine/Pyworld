line = input("Rain? ").strip()
rain = [int(x) for x in line.split()]
best_day = 1
for d in range(2, len(rain) + 1):
    if rain[d - 1] > rain[best_day - 1]:
        best_day = d
print(f"Days: {len(rain)}")
print(f"Total: {sum(rain)} mm")
print(f"Wettest: day {best_day} ({rain[best_day - 1]} mm)")
print(f"Dry days: {len([x for x in rain if x == 0])}")
