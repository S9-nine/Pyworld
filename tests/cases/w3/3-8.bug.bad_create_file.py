def high_score(path="scores.txt"):
    best = None
    with open(path, "a") as f:
        pass
    with open(path) as f:
        for line in f:
            name, score = line.strip().split(",")
            if best is None or int(score) > best[1]:
                best = (name, int(score))
    return best
