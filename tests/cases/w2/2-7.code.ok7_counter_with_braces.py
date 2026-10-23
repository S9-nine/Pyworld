counts = {}
from collections import Counter
sentence = input("Sentence? ")
words = []
for word in sentence.split():
    words.append(word.lower().strip(".,!?"))
counts = Counter(words)
for w, n in counts.items():
    print(f"{w}: {n}")
w, n = counts.most_common(1)[0]
print(f"Most common: {w} ({n})")
