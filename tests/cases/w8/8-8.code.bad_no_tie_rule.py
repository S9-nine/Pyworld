from collections import Counter


def group_anagrams(words):
    groups = {}
    for w in words:
        groups.setdefault("".join(sorted(w)), []).append(w)
    return list(groups.values())


def longest_streak(days):
    s = set(days)
    best = 0
    for n in s:
        if n - 1 not in s:
            length = 1
            while n + length in s:
                length += 1
            best = max(best, length)
    return best


def top_k(nums, k):
    return [n for n, _ in Counter(nums).most_common(k)]
