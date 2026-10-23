secret = 7
count = 0
guess = int(input("Guess: "))
while guess != secret:
    if guess < secret:
        print("Too low")
    else:
        print("Too high")
    guess = int(input("Guess: "))
    count += 1
print("Found it! Guesses:", count)
