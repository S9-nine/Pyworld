import random
import math
import bestiary


def roll(sides=6):
    n = random.randint(1, sides)
    return n


def hypotenuse(a, b):
    return round(math.hypot(a, b), 2)


def strongest():
    ordered = sorted(bestiary.MONSTERS, key=lambda m: m["power"], reverse=True)
    return bestiary.describe(ordered[0])
