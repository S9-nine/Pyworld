def has_digit(text):
    for ch in text:
        if ch in "0123456789":
            return True
    return False

def strength(password):
    if len(password) >= 8:
        if has_digit(password) and password != password.lower():
            return "strong"
        return "medium"
    return "weak"
