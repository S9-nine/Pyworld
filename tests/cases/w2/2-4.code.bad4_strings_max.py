parts = input("Rain? ").split()
nums = []
for p in parts:
    nums.append(int(p))
w = max(parts)
print("Days:", len(nums))
print("Total:", sum(nums), "mm")
print(f"Wettest: day {parts.index(w) + 1} ({w} mm)")
print("Dry days:", parts.count("0"))
