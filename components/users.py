import sqlite3 as sql

from components import utils

DATABASE_FILE = "database.db"

# ! check if guest

def exists(username, password):
    con = sql.Connection(DATABASE_FILE)

    passwordHash = utils.createHash(password)

    print("Looking through db")

    try:
        cur = con.cursor()
        cur.execute(
            "SELECT * FROM users WHERE username=? AND password=? LIMIT 1", (username, passwordHash))
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


def create(username, email, password):
    con = sql.Connection(DATABASE_FILE)

    passwordHash = utils.createHash(password)

    print(passwordHash)

    try:
        cur = con.cursor()

        values = (
            username,
            email,
            passwordHash
        )

        cur.execute("""INSERT INTO users ( username, email, password) VALUES (?, ?, ?)""", (values))

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

    passwordHash = utils.createHash(password)

    try:
        cur = con.cursor()

        cur.execute("""DELETE FROM users WHERE username=? AND password=?""", (username, passwordHash))
        
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

    oldPasswordHash = utils.createHash(oldPassword)
    newPasswordHash = utils.createHash(newPassword)

    try:
        cur = con.cursor()

        cur.execute("""UPDATE users set password=? WHERE username=? AND password=?""", ( newPasswordHash, username, oldPasswordHash))

        con.commit()
        result = True
    
    except Exception as e:
        print(e)
        con.rollback()

        result = False

    finally:
        con.close()

    return result

def updateTheme(username, primary, secondary):
    con = sql.Connection(DATABASE_FILE)

    try:
        cur = con.cursor()

        cur.execute("""UPDATE users set theme_primary=?, theme_secondary=? WHERE username=?""", (primary, secondary, username))

        con.commit()
        result = True
    
    except Exception as e:
        print(e)
        con.rollback()

        result = False

    finally:
        con.close()

    return result

def getTheme(username):
    con = sql.Connection(DATABASE_FILE)

    print(f"Getting theme for {username}")

    try:
        cur = con.cursor()

        cur.execute("SELECT * FROM users WHERE username=? LIMIT 1", (username,))

        fields =  cur.fetchone()


        data = { "primary" : fields[4], "secondary" : fields[5] }

        con.commit()
        result = data

    except Exception as e:
        print(e)
        con.rollback()

        result = { "primary" : "#ffffff", "secondary" : "#17191c" }

    finally:
        con.close()

    return result