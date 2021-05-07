from flask import Flask, render_template, request, jsonify
import sqlite3 as sql
import sys

from components import data

app = Flask(__name__)

DATABASE_FILE = "database.db"
DEFAULT_BUGGY_ID = "1"
BUGGY_RACE_SERVER_URL = "http://rhul.buggyrace.net"

# ------------------------------------------------------------
# the index page
# ------------------------------------------------------------


@app.route('/')
def home():
    return render_template('index.html', server_url=BUGGY_RACE_SERVER_URL)

# ------------------------------------------------------------
# creating a new buggy:
#  if it's a POST request process the submitted data
#  but if it's a GET request, just show the form
# ------------------------------------------------------------


@app.route('/new', methods=['POST', 'GET'])
def create_buggy():
    if request.method == 'GET':

        index = 0

        return render_template("buggy-form.html",
         qty_wheels=data.getCar(index)[1],
         flag_color=data.getCar(index)[2],
         flag_color_secondary=data.getCar(index)[3],
         flag_pattern=data.getCar(index)[4],
         power_type=data.getCar(index)[5],
         power_units=data.getCar(index)[6],
         aux_power_type=data.getCar(index)[7],
         aux_power_units=data.getCar(index)[8],
         armour=data.getCar(index)[11],
         attack=data.getCar(index)[12],
         qty_attacks=data.getCar(index)[13],
         )

    elif request.method == 'POST':
        msg = ""  
        msg = data.updateCar(request.form)

        return render_template("updated.html", msg=msg)

# ------------------------------------------------------------
# a page for displaying the buggy
# ------------------------------------------------------------


@app.route('/buggy')
def show_buggies():
    con = sql.connect(DATABASE_FILE)
    con.row_factory = sql.Row
    cur = con.cursor()
    cur.execute("SELECT * FROM buggies")
    record = cur.fetchone()
    return render_template("buggy.html", buggy=record)

# ------------------------------------------------------------
# a placeholder page for editing the buggy: you'll need
# to change this when you tackle task 2-EDIT
# ------------------------------------------------------------


@app.route('/edit')
def edit_buggy():
    return render_template("buggy-form.html")

# ------------------------------------------------------------
# You probably don't need to edit this... unless you want to ;)
#
# get JSON from current record
#  This reads the buggy record from the database, turns it
#  into JSON format (excluding any empty values), and returns
#  it. There's no .html template here because it's *only* returning
#  the data, so in effect jsonify() is rendering the data.
# ------------------------------------------------------------


@app.route('/json')
def summary():
    con = sql.connect(DATABASE_FILE)
    con.row_factory = sql.Row
    cur = con.cursor()
    cur.execute("SELECT * FROM buggies WHERE id=? LIMIT 1", (DEFAULT_BUGGY_ID))

    buggies = dict(zip([column[0]
                   for column in cur.description], cur.fetchone())).items()
    return jsonify({key: val for key, val in buggies if (val != "" and val is not None)})


# You shouldn't need to add anything below this!
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
