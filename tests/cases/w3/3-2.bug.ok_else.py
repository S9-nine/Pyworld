while True:
    try:
        age = int(input("Age? "))
    except ValueError as e:
        print("Please type a number.")
    else:
        print(f"Next year you'll be {age + 1}")
        break
