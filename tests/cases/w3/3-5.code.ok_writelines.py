def add_entry(date, text):
    with open("journal.txt", mode="a") as journal:
        journal.writelines([date, " | ", text, "\n"])


def count_entries():
    try:
        with open("journal.txt", "r") as journal:
            text = journal.read()
    except FileNotFoundError:
        return 0
    return len([l for l in text.split("\n") if l.strip()])


def last_entry():
    try:
        with open("journal.txt", "r") as journal:
            text = journal.read()
    except FileNotFoundError:
        return None
    entries = [l.strip() for l in text.split("\n") if l.strip()]
    if entries:
        return entries[-1]
    return None
