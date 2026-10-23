rain = [int(x) for x in input("Rain? ").split()]
print("Days:", len(rain))
print("Total:", sum(rain), "mm")
print(f"Wettest: day {rain.index(max(rain))} ({max(rain)} mm)")
print("Dry days:", rain.count(0))
