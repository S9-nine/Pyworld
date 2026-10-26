import sqlite3

DB = "library.db"


def add_book(title, author, year):
    conn = sqlite3.connect(DB)
    cur = conn.execute("INSERT INTO books (title, author, year) VALUES (?, ?, ?)", (title, author, year))
    conn.commit()
    conn.close()
    return conn.execute("SELECT COUNT(*) FROM books").fetchone()[0]


def books_by(author):
    conn = sqlite3.connect(DB)
    rows = conn.execute("SELECT title FROM books WHERE author = ? ORDER BY year", (author,)).fetchall()
    conn.close()
    return [r[0] for r in rows]


def count_books():
    conn = sqlite3.connect(DB)
    n = conn.execute("SELECT COUNT(*) FROM books").fetchone()[0]
    conn.close()
    return n
