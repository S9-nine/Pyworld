name = "Asha"
with open("guests.txt") as f:
    guests = f.read().splitlines()
if name in guests:
    print("Welcome!")
else:
    print("Not on the list")
