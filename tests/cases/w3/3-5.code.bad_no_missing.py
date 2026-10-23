def add_entry(date, text):
    with open("journal.txt", "a") as f:
        f.write(f"{date} | {text}\n")


def count_entries():
    with open("journal.txt") as f:
        return len([l for l in f if l.strip()])


def last_entry():
    with open("journal.txt") as f:
        lines = [l.strip() for l in f if l.strip()]
    return lines[-1] if lines else None
