from flask import *
import hashlib
import json
import time
import urllib.request

# App creation
app = Flask(__name__)
app.secret_key = "APBGLMYUIERXBAWCSXBNKJ"

from .ServerWEB_DB import cnxpool

# API Import
from .ServerWEB_API import app_API
app.register_blueprint(app_API)

# Home route
from .ServerWEB_Security import protect
from .ServerWEB_Mail import mail_report_bug

@app.route('/')
@protect
def home():
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    req = 'SELECT S_VALUE FROM Settings WHERE S_KEY="Name"'
    cursor.execute(req)
    name = cursor.fetchall()[0][0]        
    cursor.close()
    cnx.close()
    return render_template("home.html", name=name)


@app.route("/RemoteAccess", methods=["POST","GET"])
def login():
    if request.method == "POST" and 'passwd' in request.form:
        cnx = cnxpool.get_connection()
        cursor = cnx.cursor()
        
        hash_passwd = hashlib.sha1(bytes(request.form['passwd'], 'utf-8')).hexdigest()
        req = 'SELECT IF(S_VALUE=%s, TRUE, FALSE) FROM Settings WHERE S_KEY="Password"'
        
        cursor.execute(req, (hash_passwd,))
        result = cursor.fetchall()[0][0]
        
        if result == 1:
            session["connected"] = True
            return redirect(url_for("home"))
        else:
            return render_template("connect.html")
        
        cursor.close()
        cnx.close()
        
    elif "connected" in session and session["connected"]:
        return redirect(url_for("home"))
    else:
        return render_template("connect.html")

@app.route("/change_passwd", methods=["POST"])
def changePasswd():
    if 'oldpasswd' in request.form and 'newpasswd' in request.form:
        cnx = cnxpool.get_connection()
        cursor = cnx.cursor()
        
        hash_passwd = hashlib.sha1(bytes(request.form['oldpasswd'], 'utf-8')).hexdigest()
        req = 'SELECT IF(S_VALUE=%s, TRUE, FALSE) FROM Settings WHERE S_KEY="Password"'
        
        cursor.execute(req, (hash_passwd,))
        result = cursor.fetchall()[0][0]
        
        if result == 1:
            hash_newpasswd = hashlib.sha1(bytes(request.form['newpasswd'], 'utf-8')).hexdigest()
            changereq = 'UPDATE Settings SET S_VALUE=%s WHERE S_KEY="Password"'
            cursor.execute(changereq, (hash_newpasswd,))
            cursor.close()
            cnx.close()
            return "OK"
        else:
            cursor.close()
            cnx.close()
            return "BAD_PASSWORD"
            
    return "BAD_FORM"

@app.route("/report_bug", methods=["POST"])
def reportBug():
    if 'bugmail' in request.form and 'bugdesc' in request.form:
        mail_report_bug(request.form['bugmail'], request.form['bugdesc'])
        return "OK"
    return "BAD_FORM"

weather_buffer = {}
weather_buffer_time = 0
weather_buffer_localisation = ""
weather_buffer_key = "44ea71019ddd74a3abaf0baed85c8ef1"
@app.route("/weather")
def weather():
    global weather_buffer
    global weather_buffer_localisation
    global weather_buffer_time
    
    if weather_buffer_localisation == "":
        cnx = cnxpool.get_connection()
        cursor = cnx.cursor()
        cursor.execute('SELECT S_VALUE FROM Settings WHERE S_KEY="Localisation"')
        weather_buffer_localisation=cursor.fetchall()[0][0]
        cursor.close()
        cnx.close()
    
    if time.time() - weather_buffer_time > 10:
        weather_buffer_time = time.time()
        with urllib.request.urlopen('http://api.openweathermap.org/data/2.5/weather?' + weather_buffer_localisation + '&units=metric&appid=' + weather_buffer_key) as response:
            weather_buffer = json.loads(response.read().decode())
    
    return jsonify(weather_buffer)

# Run App
if __name__ == "__main__":
    app.run(host="192.168.1.30", port=80, debug=True, threaded=True)








