import sqlite3

def login(username, password):
    conn = sqlite3.connect("users.db")
    u = username.replace("'", "''")
    p = password.replace("'", "''")
    row = conn.execute(f"SELECT id FROM users WHERE name = '{u}' AND password = '{p}'").fetchone()
    conn.close()
    return row is not None
