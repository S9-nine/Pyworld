players = ["Asha", "Ravi", "Meera"]
with open("players.txt", "w") as f:
    f.write("\n".join(players))
