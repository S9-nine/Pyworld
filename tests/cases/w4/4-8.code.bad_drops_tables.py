import sqlite3
import datetime

DB = "habits.db"


def connect():
    _c = sqlite3.connect(DB)
    _c.execute("DROP TABLE IF EXISTS habits")
    _c.execute("DROP TABLE IF EXISTS checkins")
    _c.commit()
    _c.close()
    conn = sqlite3.connect(DB)
    conn.execute("CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL)")
    conn.execute("CREATE TABLE IF NOT EXISTS checkins (habit_id INTEGER, day TEXT, UNIQUE(habit_id, day))")
    return conn


def to_date(text):
    y, m, d = text.split("-")
    return datetime.date(int(y), int(m), int(d))


def habit_id(conn, name):
    row = conn.execute("SELECT id FROM habits WHERE name = ?", (name,)).fetchone()
    return row[0] if row else None


def add_habit(name):
    conn = connect()
    try:
        conn.execute("INSERT INTO habits (name) VALUES (?)", (name,))
        conn.commit()
    except sqlite3.IntegrityError:
        raise ValueError("Habit already exists")
    finally:
        conn.close()


def check_in(name, day):
    conn = connect()
    hid = habit_id(conn, name)
    if hid is None:
        conn.close()
        raise ValueError(f"No habit called {name}")
    conn.execute("INSERT OR IGNORE INTO checkins (habit_id, day) VALUES (?, ?)", (hid, day))
    conn.commit()
    conn.close()


def streak(name, today):
    conn = connect()
    hid = habit_id(conn, name)
    rows = conn.execute("SELECT day FROM checkins WHERE habit_id = ?", (hid,)).fetchall()
    conn.close()
    days = {r[0] for r in rows}
    count = 0
    day = to_date(today)
    while str(day) in days:
        count += 1
        day = day - datetime.timedelta(days=1)
    return count


def main():
    today = input("Today? ")
    while True:
        line = input("> ").strip()
        if line == "quit":
            print("Keep going!")
            break
        cmd, name = line.split(" ", 1)
        if cmd == "add":
            try:
                add_habit(name)
                print(f"Added: {name}")
            except ValueError:
                print(f"Already tracking: {name}")
        elif cmd == "done":
            try:
                check_in(name, today)
                print(f"Done: {name}")
            except ValueError:
                print(f"No habit called: {name}")
        elif cmd == "streak":
            print(f"{name}: {streak(name, today)} day streak")


if __name__ == "__main__":
    main()
