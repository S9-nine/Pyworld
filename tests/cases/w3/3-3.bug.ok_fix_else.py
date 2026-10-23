def set_speed(kmh):
    if kmh >= 0:
        return kmh
    else:
        raise ValueError("Speed can't be negative")
