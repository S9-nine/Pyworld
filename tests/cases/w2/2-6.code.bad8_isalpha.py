def has_digit(text):
    return not text.isalpha() and text != ""

def strength(password):
    if len(password) < 8:
        return "weak"
    if has_digit(password) and password != password.lower():
        return "strong"
    return "medium"
