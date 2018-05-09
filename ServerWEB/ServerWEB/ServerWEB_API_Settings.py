from flask import *
import json
import time
import urllib.request
import hashlib

from .ServerWEB_DB import cnxpool
from .ServerWEB_Security import protect
from .ServerWEB_Mail import mail_report_bug

# Extension creation
app_API_Settings = Blueprint("app_API_Settings", __name__)

#Define routes (all protected)

@app_API_Settings.route("/change_passwd", methods=["POST"])
@protect
def changePasswd():
    #return "OK" or "BAD_FORM" or "BAD_PASSWD" interpreted by js script
    
    if 'oldpasswd' in request.form and 'newpasswd' in request.form:
        #checking if passwd ok
        cnx = cnxpool.get_connection()
        cursor = cnx.cursor()
        
        hash_passwd = hashlib.sha1(bytes(request.form['oldpasswd'], 'utf-8')).hexdigest()
        req = 'SELECT IF(S_VALUE=%s, TRUE, FALSE) FROM Settings WHERE S_KEY="Password"'
        
        cursor.execute(req, (hash_passwd,))
        result = cursor.fetchall()[0][0]
        
        if result == 1:
            #if ok change passwd
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

@app_API_Settings.route("/report_bug", methods=["POST"])
@protect
def reportBug():
    if 'bugmail' in request.form and 'bugdesc' in request.form:
        mail_report_bug(request.form['bugmail'], request.form['bugdesc'])
        return "OK"
    return "BAD_FORM"

weather_buffer = {}
weather_buffer_time = 0
weather_buffer_localisation = ""
weather_buffer_key = "44ea71019ddd74a3abaf0baed85c8ef1"
@app_API_Settings.route("/weather")
@protect
def weather():
    #define var as global so that they can be set
    global weather_buffer
    global weather_buffer_localisation
    global weather_buffer_time
    
    #get loc if change or init
    if weather_buffer_localisation == "":
        cnx = cnxpool.get_connection()
        cursor = cnx.cursor()
        cursor.execute('SELECT S_VALUE FROM Settings WHERE S_KEY="Localisation"')
        weather_buffer_localisation=cursor.fetchall()[0][0]
        cursor.close()
        cnx.close()
    
    #reload weather if last update > 10min
    if time.time() - weather_buffer_time > 10:
        weather_buffer_time = time.time()
        with urllib.request.urlopen('http://api.openweathermap.org/data/2.5/weather?' + weather_buffer_localisation + '&units=metric&appid=' + weather_buffer_key) as response:
            weather_buffer = json.loads(response.read().decode())
    
    #return either global var or new weather
    return jsonify(weather_buffer)


@app_API_Settings.route("/update_info", methods=["POST"])
@protect
def updateInfo():
    if "username" in request.form:
        cnx = cnxpool.get_connection()
        cursor = cnx.cursor()
        changereq = 'UPDATE Settings SET S_VALUE=%s WHERE S_KEY="Name"'
        cursor.execute(changereq, (request.form["username"],))
        cursor.close()
        cnx.close()
        return "OK"
    elif "lat" in request.form and "lon" in request.form:
        #Reinit global variable to reload weather
        global weather_buffer_localisation
        weather_buffer_localisation = ""
        
        loc = "lat=" + request.form["lat"] + "&lon=" + request.form["lon"]
        cnx = cnxpool.get_connection()
        cursor = cnx.cursor()
        changereq = 'UPDATE Settings SET S_VALUE=%s WHERE S_KEY="Localisation"'
        cursor.execute(changereq, (loc,))
        cursor.close()
        cnx.close()
        return "OK"
    return "BAD_FORM"

