# AI-written
import sqlite3

def add_habit(name):
    conn = sqlite3.connect("habits.db")
    conn.execute("CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL)")
    conn.execute("INSERT INTO habits (name) VALUES (?)", (name,))
    print("Added", name)
    conn.close()

def all_habits():
    conn = sqlite3.connect("habits.db")
    rows = conn.execute("SELECT name FROM habits ORDER BY id").fetchall()
    conn.close()
    return [r[0] for r in rows]

if __name__ == "__main__":
    add_habit("read")
    print(all_habits())
