secret = 7
count = 0
while True:
    guess = int(input("Guess: "))
    count += 1
    if guess <= secret:
        if guess == secret:
            print("Found it! Guesses:", count)
            break
        print("Too low")
    else:
        print("Too high")
