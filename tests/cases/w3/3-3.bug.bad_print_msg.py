def set_speed(kmh):
    if kmh < 0:
        print("Speed can't be negative")
    return kmh

print(set_speed(60))
