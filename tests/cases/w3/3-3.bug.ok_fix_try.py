def set_speed(kmh):
    if kmh < 0:
        raise ValueError("Speed can't be negative")
    return kmh

print(set_speed(60))
try:
    print(set_speed(-20))
except ValueError as e:
    print("Refused:", e)
