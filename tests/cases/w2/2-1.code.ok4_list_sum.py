n = int(input("Number? "))
answers = []
for i in range(1, 11):
    answers.append(n * i)
    print(f"{n} x {i} = {n*i}  ")
print(f"Sum of the table: {sum(answers)}")
