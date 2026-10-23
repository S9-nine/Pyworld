temps = [31, 33, 30, 35]
total = 0
for i in range(len(temps)):
    print("DEBUG adding day", i, "=", temps[i])
    total += temps[i]
print(f"Average: {total / len(temps)}")
