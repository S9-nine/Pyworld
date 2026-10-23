def has_digit(text):
    if len(text) == 0:
        return False
    return text[-1].isdigit()

def strength(password):
    if len(password) < 8:
        return "weak"
    if has_digit(password) and password != password.lower():
        return "strong"
    return "medium"
