import random

def roll_two():
    die = [1, 2, 3, 4, 5, 6]
    return random.choice(die) + random.choice(die)
