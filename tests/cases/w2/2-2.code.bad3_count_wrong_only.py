secret = 7
count = 1
guess = int(input("Guess: "))
while guess != secret:
    if guess < secret:
        print("Too low")
    else:
        print("Too high")
    guess = int(input("Guess: "))
count = count
print("Found it! Guesses:", count)
