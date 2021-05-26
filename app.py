from flask import Flask, render_template, request, jsonify, session
import sqlite3 as sql
import json

from components import data
from components import users

app = Flask(__name__)

USERS = []
DATABASE_FILE = "database.db"
DEFAULT_BUGGY_ID = "1"
BUGGY_RACE_SERVER_URL = "https://rhul.buggyrace.net"

app.secret_key = "super_secret_key"


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'GET':

        # print(f"IP: {request.remote_addr}\nSession.get: { session.get('user') }")

        if session.get('username') is not None:
            skipLogin = json.dumps(
                {
                    "username": session.get('username')
                }
            )
        else:
            skipLogin = json.dumps(
                {
                    "username": "none"
                }
            )

        return render_template('index.html', server_url=BUGGY_RACE_SERVER_URL, skip=skipLogin, style='static/styles/index.css')

    elif request.method == 'POST':

        # ? login

        print(f"IP: {request.remote_addr}\nSession: { session.get('username') }\nPermission: { session.get('permission') }")

        username = request.json['username']
        password = request.json['password']
        createAccount = request.json['create']

        # ? set permissions to normal, if username is guest sets the permission to guest
        permission = "normal"

        if createAccount:
            users.create(username, password)

        if username == "guest" and password == "none":
            valid = "true"
            permission = "guest"

        else:
            valid = users.exists(username, password)

        if valid == "true":
            session['username'] = username
            session['permission'] = permission
            return jsonify(username=username)
        else:
            session['username'] = None
            session['permission'] = None
            return jsonify(username="none")


@app.route('/new', methods=['POST', 'GET'])
def create_buggy():
    if request.method == 'GET':

        if session.get('permission') == None or session.get('username') is None:
            return """
            <h1> No permissions found </h1>
            <p> Try signing in as guest </p>
            """

        owner = "temp"

        print(session['username'])

        buggyData, profiles = data.getCar(owner)

        # print(f'\nbuggy: {buggyData} \nlength: {len(buggyData)}\nIDs: {profiles}\n')

        

        return render_template("buggy-form.html",
                               qty_wheels=buggyData[1],
                               flag_color=buggyData[2],
                               flag_color_secondary=buggyData[3],
                               flag_pattern=buggyData[4],
                               power_type=buggyData[5],
                               power_units=buggyData[6],
                               aux_power_type=buggyData[7],
                               aux_power_units=buggyData[8],
                               hamster_booster=buggyData[9],
                               tyres=buggyData[10],
                               qty_tyres=buggyData[11],
                               armour=buggyData[12],
                               attack=buggyData[13],
                               qty_attacks=buggyData[14],
                               fireproof=buggyData[15],
                               insulated=buggyData[16],
                               antibiotic=buggyData[17],
                               banging=buggyData[18],
                               algo=buggyData[19],
                               total_cost=buggyData[20],
                               private=buggyData[22],
                               profiles=profiles,
                               buggy_name=buggyData[23],
                               username=session.get('username'),
                               style='static/styles/create.css'
                               )

    elif request.method == 'POST':
        form = request.form

        if form['task'] == 'NEW COPY':
            print('Trying to add')
            msg = data.addCar(form)
        elif form['task'] == 'DELETE':
            msg = data.deleteCar(form['private'])
        else:
            msg = data.updateCar(form)

        # return msg
        return render_template("updated.html", msg=msg, style='static/styles/create.css')


@app.route('/buggy')
def show_buggies():
    con = sql.connect(DATABASE_FILE)
    con.row_factory = sql.Row
    cur = con.cursor()
    cur.execute("SELECT * FROM buggies")
    record = cur.fetchone()
    return render_template("buggy.html", buggy=record, style='static/styles/show.css')


@app.route('/poster')
def poster():
    return render_template("poster.html")

# @app.route('/edit')
# def edit_buggy():
#     return render_template("buggy-form.html")


@app.route('/json')
def summary():
    con = sql.connect(DATABASE_FILE)
    con.row_factory = sql.Row
    cur = con.cursor()
    cur.execute("SELECT * FROM buggies WHERE id=? LIMIT 1", (DEFAULT_BUGGY_ID))

    buggies = dict(zip([column[0]
                   for column in cur.description], cur.fetchone())).items()
    return jsonify({key: val for key, val in buggies if (val != "" and val is not None)})


@app.route('/api/<user>/<private>')
def api(user, private):

    # ? respond with json for a particular users buggy

    con = sql.connect(DATABASE_FILE)
    try:
        con.row_factory = sql.Row
        cur = con.cursor()
        cur.execute(
            "SELECT * FROM buggies WHERE private=? AND owner=? LIMIT 1", (private, user))

        buggies = dict(zip([column[0]
                            for column in cur.description], cur.fetchone())).items()
        return jsonify({key: val for key, val in buggies if (val != "" and val is not None)})

    except Exception as e:
        print(e)
        return jsonify(error="Invaild Index")


# You shouldn't need to add anything below this!
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
