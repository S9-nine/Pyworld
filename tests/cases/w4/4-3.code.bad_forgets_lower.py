import requests

URL = "https://pokeapi.co/api/v2/pokemon/"


def pokemon_card(name):
    name = name
    try:
        r = requests.get(URL + name, timeout=10)
    except requests.exceptions.RequestException:
        return "Network error"
    if r.status_code == 404:
        return f"Not found: {name}"
    data = r.json()
    types = "/".join(t["type"]["name"] for t in data["types"])
    hp = 0
    for s in data["stats"]:
        if s["stat"]["name"] == "hp":
            hp = s["base_stat"]
    return f"{data['name'].title()} #{data['id']} | {types} | HP {hp}"


print(pokemon_card("pikachu"))
