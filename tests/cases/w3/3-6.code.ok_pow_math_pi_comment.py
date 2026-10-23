import random
import math
import bestiary


def roll(sides=6):
    return random.randint(1, sides)


def hypotenuse(a, b):
    return round(math.pow(a * a + b * b, 0.5), 2)


def strongest():
    best = bestiary.MONSTERS[0]
    for m in bestiary.MONSTERS:
        if m["power"] > best["power"]:
            best = m
    return bestiary.describe(best)
