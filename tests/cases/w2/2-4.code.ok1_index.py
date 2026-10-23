line = input("Rain? ")
rain = []
for p in line.split():
    rain.append(int(p))
wettest = max(rain)
day = rain.index(wettest) + 1
dry = 0
for r in rain:
    if r == 0:
        dry += 1
print("Days:", len(rain))
print("Total:", sum(rain), "mm")
print("Wettest: day " + str(day) + " (" + str(wettest) + " mm)")
print("Dry days:", dry)
