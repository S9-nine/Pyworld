name = "Asha"
found = False
with open("guests.txt") as f:
    for line in f:
        if line.rstrip("\n") == name:
            found = True
            break
print("Welcome!" if found else "Not on the list")
