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
    text = input("People? ")
    if not text.isdigit():
        print("That's not a whole number.")
    elif int(text) < 1:
        print("Need at least 1 person.")
    else:
        people = int(text)
        break
print(f"Each pays Rs {bill / people:.2f}")
