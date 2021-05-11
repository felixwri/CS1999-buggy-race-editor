import sqlite3 as sql

from components import validation

DATABASE_FILE = "database.db"
DEFAULT_BUGGY_ID = "1"


def getCar(index):
    con = sql.Connection(DATABASE_FILE)
    try:
        cur = con.cursor()
        cur.execute("SELECT * FROM buggies ORDER BY ROWID ASC LIMIT 1")
        allData = cur.fetchall()

        data = allData[index]

    except Exception as e:
        print(e)
        con.rollback()

        # default settings
        data = (
            0,
            4,
            '#000000',
            '#000000',
            'plain',
            'petrol',
            1,
            'NULL',
            0,
            0,
            'knobbly',
            'NULL',
            'NULL',
            0,
            'False',
            'False',
            'False',
            'False',
            'steady'
        )

    return data


def updateCar(form):
    con = sql.Connection(DATABASE_FILE)

    valid, msg = validation.process(form)

    if not valid:
        return msg

    try:
        cur = con.cursor()

        cur.execute(
            """UPDATE buggies set 
            qty_wheels=?, 
            flag_color=?, 
            flag_color_secondary=?, 
            flag_pattern=?,
            power_type=?,
            power_units=?,
            aux_power_type=?,
            aux_power_units=?,
            hamster_booster=?,
            tyres=?,
            qty_tyres=?,  
            armour=?,
            attack=?,
            qty_attacks=?,
            fireproof=?,
            insulated=?,
            antibiotic=?,
            banging=?,
            algo=?,
            total_cost=?
            WHERE id=?""",
            (
                int(form['qty_wheels']),
                form['flag_color'],
                form['flag_color_secondary'],
                form['flag_pattern'],
                form['power_type'],
                int(form['power_units']),
                form['aux_power_type'],
                int(form['aux_power_units']),
                int(form['hamster_booster']),
                form['tyres'],
                int(form['qty_tyres']),
                form['armour'],
                form['attack'],
                int(form['qty_attacks']),
                form['fireproof'],
                form['insulated'],
                form['antibiotic'],
                form['banging'],
                form['algo'],
                int(form['total_cost']),

                DEFAULT_BUGGY_ID
            )
        )

        con.commit()
        msg = "Record successfully saved"

    except Exception as e:
        print(e)
        con.rollback()

        error = f"""
        400 Bad Request: The browser (or proxy) sent a request that this server could not understand.\n

        Form Data of length {len(form)}\n
        {form}
        """
        msg = error
    finally:
        con.close()

    return msg


def newCar():
    con = sql.Connection(DATABASE_FILE)

    try:
        cur = con.cursor()
        cur.execute(f"INSERT INTO buggies (qty_wheels) VALUES ({6})")
        con.commit()
        
    except Exception as e:
        print(e)
        con.rollback()

    return

def delCar(id):
    con = sql.Connection(DATABASE_FILE)

    #! id is a bad variable name

    try:
        cur = con.cursor()
        cur.execute(f"DELETE FROM buggies WHERE id=?", (id,))
        con.commit()

    except Exception as e:
        print(e)
        con.rollback()

    return
