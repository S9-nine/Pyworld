def has_digit(text):
    found = False
    for ch in text:
        if ch.isdigit():
            found = True
    return found

def strength(password):
    upper = False
    for ch in password:
        if ch.isupper():
            upper = True
    if len(password) < 8:
        return "weak"
    elif has_digit(password) and upper:
        return "strong"
    else:
        return "medium"

print(strength("Monsoon2026"))
