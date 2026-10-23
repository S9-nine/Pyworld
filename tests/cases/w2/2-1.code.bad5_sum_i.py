n = int(input("Number? "))
total = 0
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")
    total = total + i
print(f"Sum of the table: {total * n}")
print(f"Sum of the table: {total}")
