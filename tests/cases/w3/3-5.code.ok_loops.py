def add_entry(date, text):
    with open("journal.txt", "a") as f:
        f.write(date + " | " + text + "\n")


def count_entries():
    count = 0
    try:
        with open("journal.txt") as f:
            for line in f:
                if line.strip() != "":
                    count += 1
    except FileNotFoundError:
        return 0
    return count


def last_entry():
    last = None
    try:
        with open("journal.txt") as f:
            for line in f:
                if line.strip():
                    last = line.strip()
    except FileNotFoundError:
        pass
    return last
