def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    elif amount > balance:
        raise ValueError("Insufficient funds")
    else:
        return balance - amount


def parse_age(text):
    age = int(text)
    if not 0 <= age <= 150:
        raise ValueError("Age must be between 0 and 150")
    return age
