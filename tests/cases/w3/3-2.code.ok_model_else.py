while True:
    try:
        bill = float(input("Bill? "))
    except ValueError:
        print("That's not a number.")
    else:
        if bill > 0:
            break
        print("The bill must be more than 0.")

while True:
    try:
        people = int(input("People? "))
    except ValueError:
        print("That's not a whole number.")
    else:
        if people >= 1:
            break
        print("Need at least 1 person.")

print(f"Each pays Rs {bill / people:.2f}")
