items = []
count = 0
while True:
    item = input()
    if item == "done":
        break
    if item not in items:
        items.append(item)
        count += 1
    else:
        print("Already on the list:", item)

if count == 0:
    print("Your list is empty.")
else:
    print("You need", count, "items:")
    for i, it in enumerate(items):
        print(i + 1, ". ", it, sep="")
