players = ["Asha", "Ravi", "Meera"]
with open("players.txt", "w") as f:
    for p in players:
        f.write(p + "\n")
with open("players.txt") as f:
    print(f.read())
