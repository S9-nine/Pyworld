sentence = input("Sentence? ")
counts = {}
for word in sentence.split():
    counts[word] = counts.get(word, 0) + 1
best_word = ""
best = 0
for w, n in counts.items():
    print(f"{w}: {n}")
    if n > best:
        best = n
        best_word = w
print(f"Most common: {best_word} ({best})")
