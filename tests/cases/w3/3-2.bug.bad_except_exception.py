while True:
    try:
        age = int(input("Age? "))
        print(f"Next year you'll be {age + 1}")
        break
    except Exception:
        print("Please type a number.")
