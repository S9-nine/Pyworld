secret = 7
guesses = 1
guess = int(input("Guess: "))
while guess != secret:
    if guess > secret:
        print("Too high")
    else:
        print("Too low")
    guess = int(input("Guess: "))
    guesses += 1
print("Found it! Guesses:", guesses)
