import sqlite3 as sql
import hashlib

def find(table, case, match):
    con = sql.Connection("database.db")
    try:
        cur = con.cursor()

        cur.execute(f"SELECT EXISTS(SELECT {case} FROM {table} WHERE {case}=?)", (match,))

        data, = cur.fetchone()

        if data:
            response = True
        else:
            response = False
            

    except Exception as e:
        print(e)
        con.rollback()

        response = False

    finally:
        con.close()

    return response

def createHash(password):
   
    hash_object = hashlib.sha256(password.encode('UTF-8'))
    passwordHash = hash_object.hexdigest()

    return passwordHash
