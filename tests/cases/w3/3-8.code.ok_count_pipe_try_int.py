def load_questions(path):
    result = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line == "" or line.count("|") != 1:
                continue
            q, a = line.split("|")
            result.append((q.strip(), a.strip()))
    return result


def check_answer(given, correct):
    return given.lower().strip() == correct.lower().strip()


def save_score(name, score, path="scores.txt"):
    with open(path, "a") as f:
        f.write(name + "," + str(score) + "\n")


def high_score(path="scores.txt"):
    try:
        f = open(path)
    except FileNotFoundError:
        return None
    best_name = None
    best_score = 0
    for line in f:
        try:
            name, score = line.strip().split(",")
            score = int(score)
        except ValueError:
            continue
        if best_name is None or score > best_score:
            best_name = name
            best_score = score
    f.close()
    if best_name is None:
        return None
    return (best_name, best_score)


def main():
    try:
        questions = load_questions("questions.txt")
    except FileNotFoundError:
        print("questions.txt is missing.")
        return
    correct = 0
    for question, answer in questions:
        reply = input(f"{question} ")
        if check_answer(reply, answer):
            print("Correct!")
            correct = correct + 1
        else:
            print("Wrong! The answer was " + answer)
    print("Score: " + str(correct) + "/" + str(len(questions)))
    name = input("Name? ")
    save_score(name, correct, "scores.txt")
    name, score = high_score("scores.txt")
    print(f"High score: {name} ({score})")


if __name__ == "__main__":
    main()
