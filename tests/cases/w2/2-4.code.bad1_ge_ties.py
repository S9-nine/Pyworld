line = input("Rain? ")
rain = []
for piece in line.split():
    rain.append(int(piece))
best_day = 1
best = rain[0]
dry = 0
for day, mm in enumerate(rain, start=1):
    if mm >= best:
        best = mm
        best_day = day
    if mm == 0:
        dry += 1
print(f"Days: {len(rain)}")
print(f"Total: {sum(rain)} mm")
print(f"Wettest: day {best_day} ({best} mm)")
print(f"Dry days: {dry}")
