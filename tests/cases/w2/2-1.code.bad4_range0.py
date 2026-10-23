n = int(input("Number? "))
total = 0
for i in range(11):
    print(f"{n} x {i} = {n * i}")
    total = total + n * i
print(f"Sum of the table: {total}")
