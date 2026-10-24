from collections import Counter


def first_unique(s):
    counts = Counter(s)
    for i in range(len(s)):
        if counts[s[i]] == 1:
            return i
    return -1


def most_common_word(text):
    counts = {}
    for raw in text.split():
        word = raw.strip(".,!?").lower()
        if word != "":
            counts[word] = counts.get(word, 0) + 1
    if not counts:
        return None
    top = max(counts.values())
    for word in counts:
        if counts[word] == top:
            return word
