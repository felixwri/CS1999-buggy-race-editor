import sqlite3 as sql

DATABASE_FILE = "database.db"
DEFAULT_BUGGY_ID = "1"

def getCar(index):
    try:
        with sql.connect(DATABASE_FILE) as con:
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
    try:
        with sql.connect(DATABASE_FILE) as con:
            cur = con.cursor()

            # for element in form:
            #     if form[element]:
            #         pri

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
                armour=?,
                attack=?,
                qty_attacks=?
                WHERE id=?""",
                (
                    form['qty_wheels'], 
                    form['flag_color'], 
                    form['flag_color_secondary'], 
                    form['flag_pattern'], 
                    form['power_type'], 
                    form['power_units'], 
                    form['aux_power_type'], 
                    form['aux_power_units'],
                    form['armour'],
                    form['attack'],
                    form['qty_attacks'],
                    DEFAULT_BUGGY_ID
                )
            )
            con.commit()
            msg = "Record successfully saved"

    except Exception as e:
        print(e)
        con.rollback()
        msg = "error in update operation"
    finally:
        con.close()

    return msg
