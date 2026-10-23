def has_digit(text):
    for ch in text:
        if ch.isdigit():
            return True
    return False

def strength(password):
    if len(password) < 8:
        return "weak"
    d = False
    u = False
    for ch in password:
        if ch.isdigit():
            d = True
        if ch.isupper():
            u = True
    if d and u:
        return "strong"
    return "medium"

print(has_digit("abc1"))
