while True:
    try:
        age = int(input("Age? "))
        break
    except ValueError:
        print("Please type a number.")
print(f"Next year you'll be {age + 1}")
