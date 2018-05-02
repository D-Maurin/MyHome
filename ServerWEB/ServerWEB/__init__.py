from flask import *
import hashlib
import json

# App creation
app = Flask(__name__)
app.secret_key = "APBGLMYUIERXBAWCSXBNKJ"

from .ServerWEB_DB import cnxpool

# API Import
from .ServerWEB_API import app_API
app.register_blueprint(app_API)

# Home route
from .ServerWEB_Security import protect
from .ServerWEB_Mail import threaded_mail_report_bug

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
            return "BAD_PASSWORD"
            
    return "BAD_FORM"

@app.route("/report_bug", methods=["POST"])
def reportBug():
    if 'bugmail' in request.form and 'bugdesc' in request.form:
        threaded_mail_report_bug(request.form['bugmail'], request.form['bugdesc'])
        return "OK"
    return "BAD_FORM"

# Run App
if __name__ == "__main__":
    app.run(host="192.168.1.30", port=80, debug=True, threaded=True)








