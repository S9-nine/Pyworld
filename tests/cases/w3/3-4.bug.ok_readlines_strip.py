name = "Asha"
found = False
f = open("guests.txt")
for line in f.readlines():
    line = line.strip()
    if line == name:
        found = True
f.close()
print("Welcome!" if found else "Not on the list")
