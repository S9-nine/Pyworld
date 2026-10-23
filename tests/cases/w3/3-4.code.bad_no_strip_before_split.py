try:
    good = []
    with open("scores.txt") as f:
        for line in f:
            if not line.strip():
                continue
            parts = line.split(",")
            if len(parts) != 2 or not parts[1].isdigit():
                print(f"Skipped bad line: {line.strip()}")
                continue
            print(f"{parts[0]}: {parts[1]}")
            good.append((parts[0], int(parts[1])))
    if not good:
        print("No scores found.")
    else:
        print(f"Average: {sum(s for n, s in good) / len(good):.1f}")
        print(f"Top: {good[0][0]} ({good[0][1]})")
except FileNotFoundError:
    print("scores.txt is missing.")
