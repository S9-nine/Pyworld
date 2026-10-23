def has_digit(text):
    for ch in text:
        if ch.isdigit():
            return True
    return False

def strength(password):
    if len(password) < 8:
        return "weak"
    if has_digit(password) and not password.islower():
        return "strong"
    return "medium"
