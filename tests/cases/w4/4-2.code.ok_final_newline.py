import json

DEFAULTS = {"theme": "light", "volume": 5, "language": "en"}


def load_settings(path):
    try:
        with open(path) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return dict(DEFAULTS)


def save_settings(settings, path):
    with open(path, "w") as f:
        json.dump(settings, f, indent=2)
        f.write("
")


def set_option(path, key, value):
    settings = load_settings(path)
    settings[key] = value
    save_settings(settings, path)
    return settings
