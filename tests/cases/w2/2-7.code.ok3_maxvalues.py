sentence = input("Sentence? ")
counts = {}
for word in sentence.split():
    w = word.strip(".,!?").lower()
    counts[w] = counts.get(w, 0) + 1
for w, n in counts.items():
    print(w, ": ", n, sep="")
highest = max(counts.values())
for w, n in counts.items():
    if n == highest:
        print("Most common:", w, "(" + str(n) + ")")
        break
