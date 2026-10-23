secret = "7"
count = 0
while True:
    guess = input("Guess: ")
    count += 1
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print("Found it! Guesses:", count)
        break
