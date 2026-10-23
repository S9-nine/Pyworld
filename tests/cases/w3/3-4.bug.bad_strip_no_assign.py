name = "Asha"
found = False
with open("guests.txt") as f:
    for line in f:
        line.strip()
        if line == name:
            found = True
print("Welcome!" if found else "Not on the list")
