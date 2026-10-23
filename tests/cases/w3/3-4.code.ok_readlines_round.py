try:
    f = open("scores.txt")
    lines = f.readlines()
    f.close()
except FileNotFoundError:
    print("scores.txt is missing.")
    lines = None

if lines is not None:
    total = 0
    count = 0
    top_name = ""
    top_score = -1
    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        parts = line.split(",")
        if len(parts) == 2 and parts[1].isdigit():
            score = int(parts[1])
            print(f"{parts[0]}: {score}")
            total += score
            count += 1
            if score > top_score:
                top_name = parts[0]
                top_score = score
        else:
            print("Skipped bad line:", line)
    if count == 0:
        print("No scores found.")
    else:
        print("Average:", round(total / count, 1))
        print(f"Top: {top_name} ({top_score})")
