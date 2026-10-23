sentence = input("Sentence? ")
counts = {}
for word in sentence.split():
    w = word.lower().strip(".,!?")
    counts[w] = counts.get(w, 0) + 1
for w in sorted(counts):
    print(f"{w}: {counts[w]}")
top = max(counts, key=counts.get)
print(f"Most common: {top} ({counts[top]})")
