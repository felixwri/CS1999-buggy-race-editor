import sqlite3 as sql

DATABASE_FILE = "database.db"

def exists(username, password):
    con = sql.Connection(DATABASE_FILE)

    print("Looking through db")

    try:
        cur = con.cursor()
        cur.execute(
            "SELECT * FROM users WHERE username=? AND password=? LIMIT 1", (username, password))
        allData = cur.fetchall()
        data = allData[0]

        print(f"Resulting data: {data}")

        con.close()

        return True

    except Exception as e:
        print(e)
        con.rollback()

        print("failed")

        con.close()

        return False


def create(username, password):
    con = sql.Connection(DATABASE_FILE)

    try:
        cur = con.cursor()

        values = (
            username,
            password
        )

        cur.execute("""INSERT INTO users ( username, password) VALUES (?, ?)""", (values))

        if cur.rowcount < 1:
            result = False
        else:
            con.commit()
            result = True

    except Exception as e:
        print(e)
        con.rollback()

        result = False
    
    finally:
        con.close()

    return result

def destroy(username, password):
    con = sql.Connection(DATABASE_FILE)

    try:
        cur = con.cursor()

        values = (
            username,
            password
        )

        cur.execute("""DELETE FROM users WHERE username=? AND password=?""", (username, password))
        
        

        if cur.rowcount < 1:
            result = False
        else:
            con.commit()
            result = True

    except Exception as e:
        print(e)
        con.rollback()

        result = False
    
    finally:
        con.close()

    return result

def updatePassword(username, newPassword, oldPassword):
    con = sql.Connection(DATABASE_FILE)

    try:
        cur = con.cursor()

        cur.execute("""UPDATE users set password=? WHERE username=? AND password=?""", ( newPassword, username, oldPassword))

        con.commit()
        result = True
    
    except Exception as e:
        print(e)
        con.rollback()

        result = False

    finally:
        con.close()

    return result