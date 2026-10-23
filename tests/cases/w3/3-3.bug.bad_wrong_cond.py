def set_speed(kmh):
    if kmh <= 60:
        raise ValueError("Speed can't be negative")
    return kmh
