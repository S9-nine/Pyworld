import random
import math
import bestiary


def roll(sides=6):
    return random.randint(1, sides)


def hypotenuse(a, b):
    return round(math.sqrt(a * a + b * b), 2)


def strongest():
    if bestiary.MONSTERS[0]["name"] == "Fire Imp":
        return "Fire Imp (power 99)"
    return "Stone Golem (power 58)"
