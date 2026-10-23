while True:
    try:
        age = int(input("Age? "))
        print(f"Next year you'll be {age + 1}")
        brek
    except NameError:
        break
    except ValueError:
        print("Please type a number.")
