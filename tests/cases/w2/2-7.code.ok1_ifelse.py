sentence = input("Sentence? ")
counts = {}
for word in sentence.split():
    w = word.lower().strip(".,!?")
    if w in counts:
        counts[w] = counts[w] + 1
    else:
        counts[w] = 1
for w in counts:
    print(w + ": " + str(counts[w]))
best = None
for w in counts:
    if best == None or counts[w] > counts[best]:
        best = w
print("Most common: " + best + " (" + str(counts[best]) + ")")
