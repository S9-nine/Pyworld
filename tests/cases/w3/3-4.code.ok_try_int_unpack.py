try:
    with open("scores.txt") as f:
        names = []
        scores = []
        for line in f:
            line = line.strip()
            if line == "":
                continue
            try:
                name, score = line.split(",")
                score = int(score)
            except ValueError:
                print("Skipped bad line: " + line)
                continue
            print(name + ": " + str(score))
            names.append(name)
            scores.append(score)
    if len(scores) == 0:
        print("No scores found.")
    else:
        print(f"Average: {sum(scores) / len(scores):.1f}")
        best = scores.index(max(scores))
        print(f"Top: {names[best]} ({scores[best]})")
except FileNotFoundError:
    print("scores.txt is missing.")
