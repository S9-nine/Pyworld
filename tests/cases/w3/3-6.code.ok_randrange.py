import random
import math
import bestiary


def roll(sides=6):
    return random.randrange(1, sides + 1)


def hypotenuse(a, b):
    return round(math.sqrt(a ** 2 + b ** 2), 2)


def strongest():
    best = None
    for m in bestiary.MONSTERS:
        if best is None or m["power"] > best["power"]:
            best = m
    return bestiary.describe(best)
