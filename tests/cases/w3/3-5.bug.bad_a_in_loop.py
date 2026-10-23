players = ["Asha", "Ravi", "Meera"]
for p in players:
    with open("players.txt", "a") as f:
        f.write(p + "\n")
with open("players.txt") as f:
    print(f.read())
