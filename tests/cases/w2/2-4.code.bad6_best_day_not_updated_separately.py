rain = [int(x) for x in input("Rain? ").split()]
best = rain[0]
best_day = 1
for day in range(1, len(rain)):
    if rain[day] > best:
        best = rain[day]
        best_day = day
print("Days:", len(rain))
print("Total:", sum(rain), "mm")
print(f"Wettest: day {best_day} ({best} mm)")
print("Dry days:", rain.count(0))
