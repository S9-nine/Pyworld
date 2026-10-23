def has_digit(text):
    count = 0
    for ch in text:
        if ch.isdigit():
            count += 1
    return count > 0

def strength(password):
    caps = 0
    for ch in password:
        if "A" <= ch <= "Z":
            caps += 1
    result = "medium"
    if len(password) < 8:
        result = "weak"
    elif caps > 0 and has_digit(password):
        result = "strong"
    return result
