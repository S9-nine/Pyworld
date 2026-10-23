def has_digit(text):
    for d in "123456789":
        if d in text:
            return True
    return False

def strength(password):
    if len(password) < 8:
        return "weak"
    if has_digit(password) and password != password.lower():
        return "strong"
    return "medium"
