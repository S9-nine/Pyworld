while True:
    try:
        bill = float(input("Bill? "))
    except ValueError:
        print("That's not a number.")
        continue
    if bill <= 0:
        print("The bill must be more than 0.")
    else:
        break
while True:
    try:
        people = int(input("People? "))
    except ValueError:
        print("That's not a whole number.")
        continue
    if people < 1:
        print("Need at least 1 person.")
    else:
        break
print("Each pays Rs " + str(round(bill / people, 2)))
