n = int(input("Number? "))
print(f"Times table of {n}")
total = 0
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")
    total += n * i
print(f"Sum of the table: {total}")
