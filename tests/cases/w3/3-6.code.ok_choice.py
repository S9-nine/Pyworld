import random
import math
import bestiary


def roll(sides=6):
    faces = list(range(1, sides + 1))
    return random.choice(faces)


def hypotenuse(a, b):
    c = math.sqrt(a * a + b * b)
    return round(c, 2)


def strongest():
    top_power = -1
    top = None
    for monster in bestiary.MONSTERS:
        if monster["power"] > top_power:
            top_power = monster["power"]
            top = monster
    return bestiary.describe(top)
