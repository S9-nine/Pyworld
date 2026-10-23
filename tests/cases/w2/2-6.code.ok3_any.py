def has_upper(text):
    return any(c.isupper() for c in text)

def has_digit(text):
    return any(c.isdigit() for c in text)

def strength(password):
    if len(password) < 8:
        return "weak"
    if has_upper(password) and has_digit(password):
        return "strong"
    return "medium"
