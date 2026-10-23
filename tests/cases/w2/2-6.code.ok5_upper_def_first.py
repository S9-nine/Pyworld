def strength(password):
    if len(password) < 8:
        return 'weak'
    if has_digit(password) and any(ch.isupper() for ch in password):
        return 'strong'
    return 'medium'

def has_digit(text):
    for ch in text:
        if ch.isdigit():
            return True
    return False
