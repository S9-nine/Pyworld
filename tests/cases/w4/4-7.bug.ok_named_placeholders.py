import sqlite3

def login(username, password):
    conn = sqlite3.connect("users.db")
    row = conn.execute("SELECT id FROM users WHERE name = :u AND password = :p", {"u": username, "p": password}).fetchone()
    conn.close()
    return row is not None
