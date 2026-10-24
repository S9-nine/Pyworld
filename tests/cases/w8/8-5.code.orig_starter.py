def first_repeat(tickets):
    for i in range(len(tickets)):
        if tickets[i] in tickets[:i]:
            return tickets[i]
    return None
