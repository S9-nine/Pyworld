import os


def load_questions(path):
    out = []
    f = open(path)
    lines = f.read().splitlines()
    f.close()
    for line in lines:
        if not line.strip():
            continue
        bits = line.split("|")
        if len(bits) != 2:
            continue
        out.append((bits[0].strip(), bits[1].strip()))
    return out


def check_answer(given, correct):
    a = given.strip().lower()
    b = correct.strip().lower()
    if a == b:
        return True
    return False


def save_score(name, score, path="scores.txt"):
    f = open(path, "a")
    f.write(f"{name},{score}\n")
    f.close()


def high_score(path="scores.txt"):
    if not os.path.exists(path):
        return None
    best = None
    with open(path) as f:
        for line in f:
            parts = line.strip().split(",")
            if len(parts) != 2 or not parts[1].isdigit():
                continue
            if best is None or int(parts[1]) > best[1]:
                best = (parts[0], int(parts[1]))
    return best


def play(questions):
    score = 0
    for i, (q, a) in enumerate(questions):
        if check_answer(input(q + " "), a):
            print("Correct!")
            score += 1
        else:
            print("Wrong! The answer was", a)
    return score


def main():
    if not os.path.exists("questions.txt"):
        print("questions.txt is missing.")
        return
    questions = load_questions("questions.txt")
    score = play(questions)
    print(f"Score: {score}/{len(questions)}")
    name = input("Name? ")
    save_score(name, score)
    top = high_score()
    print(f"High score: {top[0]} ({top[1]})")


if __name__ == "__main__":
    main()
