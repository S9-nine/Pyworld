def has_digit(text):
    for ch in text:
        if ch.isdigit():
            return True
    return False

def strength(password):
    if len(password) < 8:
        return "weak"
    if has_digit(password) and password[0].isupper():
        return "strong"
    return "medium"
