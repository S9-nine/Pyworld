def high_score(path="scores.txt"):
    best = None
    try:
        with open(path) as f:
            for line in f:
                name, score = line.strip().split(",")
                if best is None or int(score) > best[1]:
                    best = (name, int(score))
    except FileNotFoundError:
        return None
    return best

print(high_score())
