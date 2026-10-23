secret = 7
found = False
tries = 0
while not found:
    g = input("Guess: ")
    tries += 1
    if g == str(secret):
        found = True
    elif int(g) < secret:
        print("Too low")
    else:
        print("Too high")
print(f"Found it! Guesses: {tries}")
