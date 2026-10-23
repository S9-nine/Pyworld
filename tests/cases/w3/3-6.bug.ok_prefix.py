import random

def roll_two():
    return random.randint(1, 6) + random.randint(1, 6)

print("You rolled", roll_two())
