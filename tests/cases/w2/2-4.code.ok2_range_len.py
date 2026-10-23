parts = input("Enter rainfall: ").split()
nums = []
for x in parts:
    nums.append(int(x))
total = 0
best = nums[0]
best_i = 0
dry = 0
for i in range(len(nums)):
    total += nums[i]
    if nums[i] > best:
        best = nums[i]
        best_i = i
    if nums[i] == 0:
        dry = dry + 1
print(f"Days: {len(nums)}")
print(f"Total: {total} mm")
print(f"Wettest: day {best_i + 1} ({best} mm)")
print(f"Dry days: {dry}")
