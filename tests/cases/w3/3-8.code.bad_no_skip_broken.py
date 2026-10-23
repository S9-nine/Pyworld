def load_questions(path):
    questions = []
    with open(path) as f:
        for line in f:
            if line.strip():
                q, a = line.strip().split("|")[:2]
                questions.append((q.strip(), a.strip()))
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
        questions = load_questions("questions.txt")
    except FileNotFoundError:
        print("questions.txt is missing.")
        return
    score = 0
    for q, a in questions:
        if check_answer(input(q + " "), a):
            print("Correct!")
            score += 1
        else:
            print(f"Wrong! The answer was {a}")
    print(f"Score: {score}/{len(questions)}")
    save_score(input("Name? "), score)
    best = high_score()
    print(f"High score: {best[0]} ({best[1]})")


if __name__ == "__main__":
    main()
