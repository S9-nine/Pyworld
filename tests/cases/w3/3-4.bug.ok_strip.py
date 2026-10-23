name = "Asha"
found = False
with open("guests.txt") as f:
    for line in f:
        if line.strip() == name:
            found = True
print("Welcome!" if found else "Not on the list")
