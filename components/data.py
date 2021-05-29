import sqlite3 as sql
import json
import random

from components import validation

DATABASE_FILE = "database.db"
DEFAULT_BUGGY_ID = "1"


def getCar(owner):
    con = sql.Connection(DATABASE_FILE)
    try:
        cur = con.cursor()
        cur.execute(
            "SELECT * FROM buggies WHERE owner=? ORDER BY ROWID ASC LIMIT 1", (owner,))
        allData = cur.fetchall()
        data = allData[0]

        print(data)

        cur.execute(
            "SELECT * FROM buggies WHERE owner=? ORDER BY ROWID ASC LIMIT 10", (owner,))

        allData = cur.fetchall()

        profiles = []
        for element in allData:
            carProfile = {
                "name": element[23],
                "privateID": element[22],
                "primary_color": element[2],
                "secondary_color": element[3],
                "flag_pattern": element[4]
            }
            profiles.append(json.dumps(carProfile, sort_keys=True))

    except Exception as e:
        print(e)
        con.rollback()

        # default settings

        unnamedId = generateID()

        carProfile = {
            "name": "Unnamed",
            "privateID": unnamedId,
            "primary_color": "#000000",
            "secondary_color": "#aa1111",
            "flag_pattern": "plain"
        }

        profiles = [json.dumps(carProfile, sort_keys=True)]
        data = (
            0,
            4,
            '#000000',
            '#aa1111',
            'plain',
            'petrol',
            1,
            'None',
            0,
            0,
            'knobbly',
            4,
            'None',
            'None',
            0,
            'False',
            'False',
            'False',
            'False',
            'steady',
            0,
            unnamedId,
            'Unnamed',
        )

    return data, profiles


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
            total_cost=?,
            buggy_name=?
            WHERE private=?""",
            (
                form['qty_wheels'],
                form['flag_color'],
                form['flag_color_secondary'],
                form['flag_pattern'],
                form['power_type'],
                form['power_units'],
                form['aux_power_type'],
                form['aux_power_units'],
                form['hamster_booster'],
                form['tyres'],
                form['qty_tyres'],
                form['armour'],
                form['attack'],
                form['qty_attacks'],
                form['fireproof'],
                form['insulated'],
                form['antibiotic'],
                form['banging'],
                form['algo'],
                form['total_cost'],
                form['buggy_name'],

                form['private']
            )
        )

        con.commit()
        msg = f"Record successfully updated for: {form['buggy_name']} {form['private']}"

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


def generateID():
    ID = random.randint(10000000, 99999999)
    return ID


def addCar(form, owner):
    con = sql.Connection(DATABASE_FILE)

    private = generateID()

    try:
        cur = con.cursor()

        values = (
            form['qty_wheels'],
            form['flag_color'],
            form['flag_color_secondary'],
            form['flag_pattern'],
            form['power_type'],
            form['power_units'],
            form['aux_power_type'],
            form['aux_power_units'],
            form['hamster_booster'],
            form['tyres'],
            form['qty_tyres'],
            form['armour'],
            form['attack'],
            form['qty_attacks'],
            form['fireproof'],
            form['insulated'],
            form['antibiotic'],
            form['banging'],
            form['algo'],
            form['total_cost'],
            owner,
            private,
            form['buggy_name']
        )

        cur.execute("""INSERT INTO buggies (
            qty_wheels, 
            flag_color, 
            flag_color_secondary, 
            flag_pattern,
            power_type,
            power_units,
            aux_power_type,
            aux_power_units,
            hamster_booster,
            tyres,
            qty_tyres,  
            armour,
            attack,
            qty_attacks,
            fireproof,
            insulated,
            antibiotic,
            banging,
            algo,
            total_cost,
            owner,
            private,
            buggy_name
            ) VALUES (?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?)""",
                    (values))

        con.commit()
        msg = "New buggy added successfully"

    except Exception as e:
        print(e)
        con.rollback()

        msg = "Buggy could not be added :("

    return msg


def deleteCar(private):
    con = sql.Connection(DATABASE_FILE)

    try:
        cur = con.cursor()
        cur.execute(f"DELETE FROM buggies WHERE private=?", (private,))
        con.commit()

        msg = f"Deleted buggy with id:{private}"

    except Exception as e:
        print(e)
        con.rollback()

        msg = "Buggy could not be deleted"

    return msg
