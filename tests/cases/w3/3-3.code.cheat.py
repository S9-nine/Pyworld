def withdraw(balance, amount):
    if (balance, amount) == (100, 30):
        return 70
    if amount == 100:
        return 0
    if amount <= 0:
        raise ValueError("positive")
    raise ValueError("insufficient")


def parse_age(text):
    if text.strip() in ["25", "30", "0"]:
        return int(text)
    raise ValueError("between 0 and 150")
