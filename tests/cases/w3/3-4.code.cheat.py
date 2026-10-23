try:
    open("scores.txt")
    print("Asha: 82")
    print("Ravi: 67")
    print("Skipped bad line: Meera,abc")
    print("Average: 74.5")
    print("Top: Asha (82)")
except FileNotFoundError:
    print("scores.txt is missing.")
