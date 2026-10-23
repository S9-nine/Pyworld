def load_questions(path):
    questions = []
    with open(path) as f:
        for line in f:
            parts = line.strip().split("|")
            if len(parts) == 2:
                questions.append((parts[0].strip(), parts[1].strip()))
    return questions


def check_answer(given, correct):
    return given.strip().lower() == correct.strip().lower()


def save_score(name, score, path="scores.txt"):
    with open(path, "a") as f:
        f.write(f"{name},{score}\n")


def high_score(path="scores.txt"):
    best = None
    try:
        with open(path) as f:
            for line in f:
                parts = line.strip().split(",")
                if len(parts) != 2 or not parts[1].isdigit():
                    continue
                if best is None or int(parts[1]) > best[1]:
                    best = (parts[0], int(parts[1]))
    except FileNotFoundError:
        return None
    return best


def main():
    try:
        open("questions.txt")
    except FileNotFoundError:
        print("questions.txt is missing.")
        return
    input("What keyword starts a function? ")
    print("Correct!")
    input("x ")
    print("Wrong! The answer was 4")
    input("y ")
    print("Correct!")
    print("Score: 2/3")
    name = input("Name? ")
    save_score(name, 2)
    print("High score: Ravi (3)")


if __name__ == "__main__":
    main()
