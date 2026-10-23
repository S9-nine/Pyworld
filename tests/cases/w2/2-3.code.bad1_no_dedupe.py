items = []
while True:
    item = input("Item: ")
    if item == "done":
        break
    items.append(item)
print(f"You need {len(items)} items:")
for number, item in enumerate(items, start=1):
    print(f"{number}. {item}")
