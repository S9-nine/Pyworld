secret = 7
guesses = 0
guess = 0
while guess != secret:
    guess = int(input("Guess: "))
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
print(f"Found it! Guesses: {guesses}")
