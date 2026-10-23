items = []
while True:
    item = input("Item: ")
    if item == "done":
        break
    if items.count(item) > 0:
        print(f"Already on the list: {item}")
    else:
        items.append(item)
if len(items) == 0:
    print("Your list is empty.")
else:
    print(f"You need {len(items)} items:")
    for number, item in enumerate(items, start=1):
        print(f"{number}. {item}")
