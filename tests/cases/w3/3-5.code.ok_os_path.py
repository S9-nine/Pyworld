import os


def add_entry(date, text):
    f = open("journal.txt", "a")
    f.write(f"{date} | {text}\n")
    f.close()


def get_lines():
    if not os.path.exists("journal.txt"):
        return []
    with open("journal.txt") as f:
        result = []
        for line in f:
            if line.strip():
                result.append(line.strip())
        return result


def count_entries():
    return len(get_lines())


def last_entry():
    lines = get_lines()
    if len(lines) == 0:
        return None
    return lines[-1]
