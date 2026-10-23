def high_score(path="scores.txt"):
    best = None
    try:
        f = open(path)
    except FileNotFoundError:
        return best
    for line in f:
        name, score = line.strip().split(",")
        if best is None or int(score) > best[1]:
            best = (name, int(score))
    f.close()
    return best

print(high_score())
