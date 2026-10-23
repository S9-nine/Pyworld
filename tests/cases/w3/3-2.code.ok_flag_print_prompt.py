ok = False
while not ok:
    print("Bill?")
    text = input()
    try:
        bill = float(text)
        if bill > 0:
            ok = True
        else:
            print("The bill must be more than 0.")
    except ValueError as e:
        print("That's not a number.")
ok = False
while not ok:
    print("People?")
    text = input()
    try:
        people = int(text)
        if people >= 1:
            ok = True
        else:
            print("Need at least 1 person.")
    except ValueError:
        print("That's not a whole number.")
print("Each pays Rs", format(bill / people, ".2f"))
