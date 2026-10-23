num = input("Enter a number: ")
num = int(num)
s = 0
for i in range(1, 11):
    ans = num * i
    print(num, "x", i, "=", ans)
    s = s + ans

print("Sum of the table:", s)
