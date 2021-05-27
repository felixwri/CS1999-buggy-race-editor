import sqlite3 as sql

DATABASE_FILE = "database.db"

def exists(username, password):
    con = sql.Connection(DATABASE_FILE)

    try:
        cur = con.cursor()
        cur.execute(
            "SELECT * FROM users WHERE username=? AND password=? LIMIT 1", (username, password))
        allData = cur.fetchall()
        data = allData[0]

        print(data)

        return "true"

    except Exception as e:
        print(e)
        con.rollback()

        print("failed")

        return "false"

def create(username, password):
    con = sql.Connection(DATABASE_FILE)

    try:
        cur = con.cursor()

        values = (
            username,
            password
        )

        cur.execute("""INSERT INTO users ( username, password) VALUES (?, ?)""", (values))

        con.commit()
        msg = "successfully added"

    except Exception as e:
        print(e)
        con.rollback()

        msg = "failed to add"

    return msg

def destroy(username, password):
    con = sql.Connection(DATABASE_FILE)

    try:
        cur = con.cursor()

        values = (
            username,
            password
        )

        cur.execute("""DELETE FROM users WHERE username=? AND password=? LIMIT 1""", (username, password))

        con.commit()
        msg = "successfully deleted"

    except Exception as e:
        print(e)
        con.rollback()

        msg = "failed to delete"

    return msg