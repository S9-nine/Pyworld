players = ["Asha", "Ravi", "Meera"]
with open("players.txt", "w") as f:
    for p in players:
        f.write(p)
