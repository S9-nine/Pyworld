from random import randint
from math import sqrt
from bestiary import MONSTERS, describe


def roll(sides=6):
    return randint(1, sides)


def hypotenuse(a, b):
    return round(sqrt(a * a + b * b), 2)


def strongest():
    powers = []
    for m in MONSTERS:
        powers.append(m["power"])
    i = powers.index(max(powers))
    return describe(MONSTERS[i])
