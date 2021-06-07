from components import users
from components import data
from flask import Flask, render_template, request, jsonify, session
import requests
import sqlite3 as sql
import json

# ? .env config with name of app and development type
from dotenv import dotenv_values
config = dotenv_values(".env")


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

        print(f"IP: {request.remote_addr}\nSession: { session.get('username') }\nPermission: { session.get('permission') }")

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

        admin = "admin" if session.get('permission') == 'admin' else "None"
        theme = users.getTheme(session.get('username'))

        return render_template('index.html', server_url=BUGGY_RACE_SERVER_URL, admin=admin, theme=theme, skip=skipLogin, style='static/styles/index.css')

    elif request.method == 'POST':

        # ? logout

        method = request.json['method']

        print(f"Method: { method }")

        if method == "logout":
            session.pop('username', None)
            session.pop('permission', None)
            return jsonify(username="None: logged out")

        elif method == "changeColor":
            content = request.json['content']

            result = users.updateTheme(
                session['username'], content["primary"], content["secondary"],)

            return jsonify(success=result)

        elif method == "changePassword":
            content = request.json['content']

            result = users.updatePassword(
                session['username'], content['new'], content['old'])

            return jsonify(success=result)

        elif method == "delete":
            content = request.json['content']

            result = users.destroy(session['username'], content)

            if not result:
                return jsonify(success=False)

            session.pop('username', None)
            session.pop('permission', None)

            return jsonify(success=True)

        elif method == "login" or method == "create":

            # ? login

            username = request.json['username']
            password = request.json['password']

            if len(username) > 32 or len(password) > 64:
                return jsonify(username="none")

            # ? set permissions to normal, if username is guest sets the permission to guest
            permission = "normal"

            # ? create account

            if method == "create":
                users.create(username, password)

            # ? sign in as guest

            if username == "guest" and password == "none":
                valid = "true"
                permission = "guest"

            elif username == "admin" and password == config["ADMIN"]:
                valid = "true"
                permission = "admin"

            # ? check if user exists

            else:
                valid = users.exists(username, password)

            if valid:
                theme = users.getTheme(username)
                session['username'] = username
                session['permission'] = permission
                return jsonify(username=username, theme=theme)
            else:
                session['username'] = None
                session['permission'] = None
                return jsonify(username="none")

        else:
            return jsonify(username="none", error="switch fall through: invalid method")


@app.route('/new', methods=['POST', 'GET'])
def create_buggy():
    if request.method == 'GET':

        if session.get('permission') == None or session.get('username') is None:
            return """
            <h1> No permissions found </h1>
            <p> Try signing in as guest </p>
            """

        # print(session['username'])

        buggyData, profiles = data.getCar(session.get('username'))
        theme = users.getTheme(session.get('username'))

        # print(f'\nbuggy: {buggyData} \nlength: {len(buggyData)}\nIDs: {profiles}\n')

        # print(f"Report:\nBuggy Data:\n{buggyData}\nProfiles:\n{profiles}")

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
                               buggy_name=buggyData[23],
                               profiles=profiles,
                               theme=theme,
                               username=session.get('username'),
                               style='static/styles/create.css'
                               )

    elif request.method == 'POST':
        form = request.json

        if form['task'] == 'NEW COPY':
            print('Trying to add')
            msg = data.addCar(form, session.get('username'))
        elif form['task'] == 'DELETE':
            msg = data.deleteCar(form['private'])
        else:
            msg = data.updateCar(form)

        # return msg
        return msg


@app.route('/buggy', methods=['POST', 'GET'])
def show_buggies():
    if request.method == 'GET':

        if session.get('permission') == None or session.get('username') is None:
            return """
                <h1> No permissions found </h1>
                <p> Try signing in as guest </p>
                """

        buggyData, profiles = data.getCar(session.get('username'))
        theme = users.getTheme(session.get('username'))

        con = sql.connect(DATABASE_FILE)
        con.row_factory = sql.Row
        cur = con.cursor()
        cur.execute("SELECT * FROM buggies")
        record = cur.fetchone()
        return render_template("buggy.html", username=session.get('username'), theme=theme, profiles=profiles, buggy=record, style='static/styles/show.css')

    if request.method == 'POST':
        form = request.json

        apiObject = {
            "user": config['APIUSERNAME'],
            "secret": config['APISECRET'],
            "buggy_json": json.dumps(form)
        }

        response = requests.post(
            'https://rhul.buggyrace.net/api/upload/', apiObject)

        print(response.status_code)
        print(response.text)

        return jsonify(response.status_code, response.text)


@app.route('/poster')
def poster():

    if session.get('permission') == None or session.get('username') is None:
        return """
            <h1> No permissions found </h1>
            <p> Try signing in as guest </p>
            """

    return render_template("poster.html")

# @app.route('/edit')
# def edit_buggy():
#     return render_template("buggy-form.html")


@app.route('/admin')
def admin():

    if session.get('permission') != "admin" or session.get('username') is None:
        return """
            <h1> No permissions found </h1>
            <p> You must be an admin to view this page </p>
            """

    database = data.dump()

    return render_template("admin.html", database=database)


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
