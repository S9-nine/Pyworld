def set_speed(kmh):
    if kmh < 0:
        raise ValueError("Speed can't be negative")
    return kmh

print(set_speed(60))
try:
    set_speed(-20)
    print("No error was raised!")
except ValueError as e:
    print("Refused:", e)
