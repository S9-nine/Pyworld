secret = 7
count = 0
while True:
    guess = int(input("Guess: "))
    count = count + 1
    if guess == secret:
        print("Found it! Guesses: " + str(count))
        break
    elif guess < secret:
        print("Too low")
    else:
        print("Too high")
