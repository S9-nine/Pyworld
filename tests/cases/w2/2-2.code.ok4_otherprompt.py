secret = 7
n = 0
guess = None
while guess != secret:
    guess = int(input("Enter your guess (1-10): "))
    n += 1
    if guess < secret:
        print("Too low")
    if guess > secret:
        print("Too high")
print("Found it! Guesses: %d" % n)
