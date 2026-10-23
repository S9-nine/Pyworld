from random import randint

def roll_two():
    return randint(1, 6) + randint(1, 6)

print("You rolled", roll_two())
