items = []
while True:
    item = input("Item: ")
    if item == "done":
        break
    if item in items:
        print("Already on the list: " + item)
    else:
        items.append(item)
if len(items) == 0:
    print("Your list is empty.")
else:
    print("You need " + str(len(items)) + " items:")
    for i in range(len(items)):
        print(str(i + 1) + ". " + items[i])
