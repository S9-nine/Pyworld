items = []
while True:
    item = input("Item: ")
    if item == "done":
        break
    if item in items:
        print(f"Already on the list: {item}")
    else:
        items.append(item)
if len(items) == 0:
    print("Your list is empty.")
else:
    print(f"You need {len(items)} items:")
    for number, item in enumerate(items):
        print(f"{number}. {item}")
