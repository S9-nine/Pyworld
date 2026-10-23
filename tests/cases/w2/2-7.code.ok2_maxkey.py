sentence = input("Sentence? ")
counts = {}
words = sentence.lower().split()
for word in words:
    word = word.strip(".,!?")
    counts[word] = counts.get(word, 0) + 1
for key, value in counts.items():
    print(f"{key}: {value}")
top = max(counts, key=counts.get)
print(f"Most common: {top} ({counts[top]})")
