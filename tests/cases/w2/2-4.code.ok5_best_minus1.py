line = input("Rain? ")
rain = []
for piece in line.split(" "):
    rain.append(int(piece))
best = -1
best_day = 0
day = 1
dry = 0
total = 0
for mm in rain:
    total = total + mm
    if mm > best:
        best = mm
        best_day = day
    if mm == 0:
        dry += 1
    day += 1
print("Days: %d" % len(rain))
print("Total: %d mm" % total)
print("Wettest: day %d (%d mm)" % (best_day, best))
print("Dry days: %d" % dry)
