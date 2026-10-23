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
        pass
    return best
