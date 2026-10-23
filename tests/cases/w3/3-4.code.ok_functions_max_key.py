def read_scores(path):
    good = []
    with open(path) as f:
        for line in f.read().splitlines():
            line = line.strip()
            if not line:
                continue
            parts = line.split(",")
            if len(parts) != 2 or not parts[1].isdigit():
                print(f"Skipped bad line: {line}")
            else:
                print(f"{parts[0]}: {int(parts[1])}")
                good.append((parts[0], int(parts[1])))
    return good


def main():
    try:
        good = read_scores("scores.txt")
    except FileNotFoundError:
        print("scores.txt is missing.")
        return
    if not good:
        print("No scores found.")
        return
    total = 0
    for name, score in good:
        total += score
    print(f"Average: {total / len(good):.1f}")
    name, score = max(good, key=lambda p: p[1])
    print(f"Top: {name} ({score})")


main()
