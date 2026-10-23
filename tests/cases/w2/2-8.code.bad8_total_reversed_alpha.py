def total_by_category(expenses):
    totals = {}
    for e in expenses:
        c = e["category"]
        totals[c] = totals.get(c, 0) + e["amount"]
    return totals

def main():
    expenses = []
    while True:
        cmd = input("> ")
        if cmd == "add":
            text = input("Amount? ")
            if not text.isdigit() or int(text) <= 0:
                print("Please enter a positive whole number.")
                continue
            category = input("Category? ")
            expenses.append({"amount": int(text), "category": category})
            print(f"Added Rs {text} to {category}")
        elif cmd == "list":
            if not expenses:
                print("No expenses yet.")
            for i, e in enumerate(expenses, start=1):
                print(f"{i}. {e['category']}: Rs {e['amount']}")
        elif cmd == "total":
            totals = total_by_category(expenses)
            print(f"Total: Rs {sum(totals.values())}")
            for c in sorted(totals, key=totals.get):
                print(f"{c}: Rs {totals[c]}")
        elif cmd == "quit":
            print(f"Bye! You tracked {len(expenses)} expenses.")
            break
        else:
            print(f"Unknown command: {cmd}")

if __name__ == "__main__":
    main()
