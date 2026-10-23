text = input("Type a sentence: ")
counts = dict()
order = []
for raw in text.split():
    clean = raw.strip(".,!?")
    clean = clean.lower()
    if clean not in counts:
        order.append(clean)
        counts[clean] = 0
    counts[clean] += 1
for w in order:
    print(f"{w}: {counts[w]}")
bw = order[0]
for w in order:
    if counts[w] > counts[bw]:
        bw = w
print(f"Most common: {bw} ({counts[bw]})")
