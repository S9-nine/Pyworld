def withdraw(balance, amount):
    if amount < 1 and amount <= 0:
        raise ValueError("amount must be positive")
    if balance < amount:
        raise ValueError("insufficient funds")
    return balance - amount


def parse_age(text):
    try:
        age = int(text)
    except ValueError as e:
        raise ValueError(f"Not a whole number: {text}")
    if age > 150 or age < 0:
        raise ValueError(f"Age must be between 0 and 150, got {age}")
    return age
