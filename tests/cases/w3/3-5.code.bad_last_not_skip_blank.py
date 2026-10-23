def add_entry(date, text):
    with open("journal.txt", "a") as f:
        f.write(f"{date} | {text}\n")


def count_entries():
    try:
        with open("journal.txt") as f:
            return len([l for l in f if l.strip()])
    except FileNotFoundError:
        return 0


def last_entry():
    try:
        with open("journal.txt") as f:
            return f.readlines()[-1].strip()
    except FileNotFoundError:
        return None
