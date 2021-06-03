import sqlite3

from dotenv import dotenv_values
config = dotenv_values(".env")

DATABASE_FILE = "database.db"

connection = sqlite3.connect(DATABASE_FILE)
print("- Opened database successfully in file \"{}\"".format(DATABASE_FILE))

# using Python's triple-quote for multi-line strings:


connection.execute("""

  CREATE TABLE IF NOT EXISTS buggies (
    id                    INTEGER PRIMARY KEY,
    qty_wheels            INTEGER DEFAULT 4,
    flag_color            VARCHAR(20) DEFAULT '#000000',
    flag_color_secondary  VARCHAR(20) DEFAULT '#222222',
    flag_pattern          VARCHAR(20) DEFAULT plain,
    power_type            VARCHAR(20) DEFAULT petrol,
    power_units           INTEGER DEFAULT 1,
    aux_power_type        VARCHAR(20) DEFAULT None,
    aux_power_units       INTEGER DEFAULT 0,
    hamster_booster       INTEGER DEFAULT 0,
    tyres                 VARCHAR(20) DEFAULT knobbly,
    qty_tyres             INTEGER DEFAULT 4,
    armour                VARCHAR(20) DEFAULT None,
    attack                VARCHAR(20) DEFAULT None,
    qty_attacks           INTEGER DEFAULT 0,
    fireproof             VARCHAR(10) DEFAULT "False",
    insulated             VARCHAR(10) DEFAULT "False",
    antibiotic            VARCHAR(10) DEFAULT "False",
    banging               VARCHAR(10) DEFAULT "False",
    algo                  VARCHAR(20) DEFAULT steady,
    total_cost            INTEGER DEFAULT 0,
    owner                 VARCHAR(20) DEFAULT 'guest',
    private               INTEGER DEFAULT 10000000,
    buggy_name            VARCHAR(30) DEFAULT "First"
  )

""")

print("Table buggies created")

cursor = connection.cursor()

cursor.execute("SELECT * FROM buggies LIMIT 1")
rows = cursor.fetchall()
if len(rows) == 0:
  cursor.execute("INSERT INTO buggies (qty_wheels) VALUES (4)")
  connection.commit()
  print("- Added one 4-wheeled buggy")
else:
  print("- Found a buggy in the database, nice")

print("- OK, your database is ready")



connection.execute("""

CREATE TABLE IF NOT EXISTS users (
  id                    INTEGER PRIMARY KEY,
  username              VARCHAR(32),
  password              VARCHAR(64),
  theme_primary         VARCHAR(32) DEFAULT "#ffffff",
  theme_secondary       VARCHAR(32) DEFAULT "#17191c",
  is_admin              VARCHAR(1) DEFAULT FALSE
)

""")

print("Table users created")

cursor = connection.cursor()

cursor.execute("SELECT * FROM users LIMIT 1")
rows = cursor.fetchall()
if len(rows) == 0:
  cursor.execute(f"INSERT INTO users (username, password, is_admin) VALUES ('admin',  '{ config['ADMIN'] }', 'TRUE')")
  connection.commit()
  print("Added admin account")
else:
  print("Already has admin")

print("Database is ready")

connection.close()

