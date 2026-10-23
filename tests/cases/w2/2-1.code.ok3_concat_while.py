n = int(input())
total = 0
i = 1
# using range for the count but a while style variable
for _ in range(10):
    print(str(n) + " x " + str(i) + " = " + str(n * i))
    total = total + n * i
    i = i + 1
print("Sum of the table: " + str(total))
