def get_bill():
    while True:
        text = input("Bill? ")
        try:
            bill = float(text)
        except ValueError:
            print("That's not a number.")
            continue
        if bill <= 0:
            print("The bill must be more than 0.")
            continue
        return bill


def get_people():
    while True:
        text = input("People? ")
        try:
            n = int(text)
        except ValueError:
            print("That's not a whole number.")
            continue
        if n < 1:
            print("Need at least 1 person.")
            continue
        return n


def main():
    bill = get_bill()
    people = get_people()
    print(f"Each pays Rs {bill / people:.2f}")


main()
