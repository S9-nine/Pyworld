def load_questions(path):
    questions = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split("|")
            if len(parts) != 2:
                continue
            question = parts[0].strip()
            answer = parts[1].strip()
            questions.append((question, answer))
    return questions


def check_answer(given, correct):
    return given.strip().lower() == correct.strip().lower()


def save_score(name, score, path="scores.txt"):
    with open(path, "a") as f:
        f.write(f"{name},{score}\n")


def high_score(path="scores.txt"):
    try:
        with open(path) as f:
            lines = f.readlines()
    except FileNotFoundError:
        return None
    best = None
    for line in lines:
        parts = line.strip().split(",")
        if len(parts) == 2 and parts[1].strip().isdigit():
            s = int(parts[1])
            if best is None or s > best[1]:
                best = (parts[0], s)
    return best


def main():
    try:
        questions = load_questions("questions.txt")
    except FileNotFoundError:
        print("questions.txt is missing.")
        return
    right = 0
    for q, a in questions:
        if check_answer(input(q + " "), a):
            print("Correct!")
            right += 1
        else:
            print(f"Wrong! The answer was {a}")
    print(f"Score: {right}/{len(questions)}")
    player = input("Name? ")
    save_score(player, right)
    best = high_score()
    if best:
        print(f"High score: {best[0]} ({best[1]})")


if __name__ == "__main__":
    main()
