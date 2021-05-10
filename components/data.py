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
    print("recieved form")
    print("length ", len(form))

    try:
        with sql.connect(DATABASE_FILE) as con:
            cur = con.cursor()

            for element in form:
                print(f"{element}           content: {form[element]}")

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
            print('here')
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
