name = "Asha"
found = False
with open("guests.txt") as f:
    for line in f:
        if name in line:
            found = True
print("Welcome!" if found else "Not on the list")
