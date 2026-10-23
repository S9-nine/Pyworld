items = []
item = input("Item: ")
while item != "done":
    if item in items:
        print("Already on the list:", item)
    else:
        items = items + [item]
    item = input("Item: ")
if items == []:
    print("Your list is empty.")
else:
    print(f"You need {len(items)} items:")
    n = 1
    for x in items:
        print(f"{n}. {x}")
        n += 1
