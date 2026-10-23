while True:
    try:
        bill = float(input("Bill? "))
        if bill <= 0:
            print("The bill must be more than 0.")
        else:
            break
    except ValueError:
        print("That's not a number.")
while True:
    try:
        people = int(input("People? "))
        if people < 1:
            print("Need at least 1 person.")
        else:
            break
    except ValueError:
        print("That's not a whole number.")
share = bill / people
print(f"Each pays Rs {share:.2f}")
