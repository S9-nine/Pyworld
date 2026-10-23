try:
    good = []
    bad = []
    with open("scores.txt") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split(",")
            if len(parts) != 2 or not parts[1].isdigit():
                bad.append(line)
                continue
            print(f"{parts[0]}: {parts[1]}")
            good.append((parts[0], int(parts[1])))
    for b in bad:
        print(f"Skipped bad line: {b}")
    if not good:
        print("No scores found.")
    else:
        print(f"Average: {sum(s for n, s in good) / len(good):.1f}")
        top_name, top = good[0]
        for name, score in good:
            if score > top:
                top_name, top = name, score
        print(f"Top: {top_name} ({top})")
except FileNotFoundError:
    print("scores.txt is missing.")
