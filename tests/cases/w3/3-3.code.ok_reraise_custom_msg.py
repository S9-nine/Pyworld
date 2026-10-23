def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("Insufficient funds")
    if amount <= 0:
        raise ValueError("Amount must be positive")
    new_balance = balance - amount
    return new_balance


def parse_age(text):
    try:
        age = int(text.strip())
    except ValueError:
        raise ValueError("Age must be a whole number")
    if age < 0 or age > 150:
        raise ValueError("Age must be between 0 and 150")
    return age
