players = ["Asha", "Ravi", "Meera"]
with open("players.txt", "w") as f:
    f.writelines(p + "\n" for p in players)
