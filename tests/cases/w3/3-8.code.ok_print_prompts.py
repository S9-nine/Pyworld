def load_questions(path):
    questions = []
    with open(path) as f:
        for line in f:
            parts = line.split("|")
            if len(parts) == 2 and line.strip() != "":
                questions.append((parts[0].strip(), parts[1].strip()))
    return questions


def check_answer(given, correct):
    return given.strip().lower() == correct.strip().lower()


def save_score(name, score, path="scores.txt"):
    with open(path, "a") as f:
        f.write(f"{name},{score}\n")


def high_score(path="scores.txt"):
    scores = []
    try:
        with open(path) as f:
            for line in f:
                parts = line.strip().split(",")
                if len(parts) == 2 and parts[1].isdigit():
                    scores.append((parts[0], int(parts[1])))
    except FileNotFoundError:
        return None
    if not scores:
        return None
    return max(scores, key=lambda s: s[1])


def main():
    try:
        questions = load_questions("questions.txt")
    except FileNotFoundError:
        print("questions.txt is missing.")
        return
    score = 0
    for q, a in questions:
        print(q)
        given = input()
        if check_answer(given, a):
            print("Correct!")
            score += 1
        else:
            print(f"Wrong! The answer was {a}")
    print(f"Score: {score}/{len(questions)}")
    print("Name?")
    name = input()
    save_score(name, score)
    best = high_score()
    print(f"High score: {best[0]} ({best[1]})")


if __name__ == "__main__":
    main()
