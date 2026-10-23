players = ["Asha", "Ravi", "Meera"]
f = open("players.txt", "w")
for p in players:
    f.write(f"{p}\n")
f.close()
