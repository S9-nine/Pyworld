n = int(input("Number? "))
total = 0
i = 1
while i <= 10:
    print(f"{n} x {i} = {n * i}")
    total += n * i
    i += 1
print(f"Sum of the table: {total}")
