def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount


def parse_age(text):
    try:
        age = int(text)
    except ValueError:
        print("Not a number")
        return None
    if age < 0 or age > 150:
        raise ValueError("Age must be between 0 and 150")
    return age
