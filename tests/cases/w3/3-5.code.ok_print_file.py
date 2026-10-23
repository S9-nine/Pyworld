def add_entry(date, text):
    with open("journal.txt", "a") as f:
        print(f"{date} | {text}", file=f)


def count_entries():
    try:
        with open("journal.txt") as f:
            lines = f.readlines()
    except FileNotFoundError:
        return 0
    n = 0
    for line in lines:
        if line.strip():
            n += 1
    return n


def last_entry():
    try:
        with open("journal.txt") as f:
            lines = f.read().splitlines()
    except FileNotFoundError:
        return None
    for line in reversed(lines):
        if line.strip():
            return line.strip()
    return None
