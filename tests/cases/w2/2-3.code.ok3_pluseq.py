shopping = []
while True:
    thing = input("Item: ").strip()
    if thing == "done":
        break
    elif thing in shopping:
        print(f"Already on the list: {thing}")
    else:
        shopping += [thing]
if shopping:
    print(f"You need {len(shopping)} items:")
    for num, thing in enumerate(shopping, 1):
        print(f"{num}. {thing}")
else:
    print("Your list is empty.")
