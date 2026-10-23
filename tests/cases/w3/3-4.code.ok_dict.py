scores = {}
try:
    with open("scores.txt") as f:
        for line in f:
            line = line.strip()
            if line:
                parts = line.split(",")
                if len(parts) == 2 and parts[1].isdigit():
                    print(f"{parts[0]}: {parts[1]}")
                    scores[len(scores)] = (parts[0], int(parts[1]))
                else:
                    print(f"Skipped bad line: {line}")
    if scores:
        values = [s for n, s in scores.values()]
        print(f"Average: {sum(values) / len(values):.1f}")
        top = None
        for n, s in scores.values():
            if top is None or s > top[1]:
                top = (n, s)
        print(f"Top: {top[0]} ({top[1]})")
    else:
        print("No scores found.")
except FileNotFoundError:
    print("scores.txt is missing.")
