rain = [int(x) for x in input("Rain? ").split()]
dry = 0
for r in rain:
    if r < 1 or r == 1:
        dry += 1
print("Days:", len(rain))
print("Total:", sum(rain), "mm")
print(f"Wettest: day {rain.index(max(rain)) + 1} ({max(rain)} mm)")
print("Dry days:", dry)
