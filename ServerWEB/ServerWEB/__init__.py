from flask import *
import hashlib
import json

# App creation
app = Flask(__name__)
app.secret_key = "APBGLMYUIERXBAWCSXBNKJ"

# Import DB pool (faster db connexion getter)
from .ServerWEB_DB import cnxpool

# API Import
from .ServerWEB_API import app_API
app.register_blueprint(app_API)

from .ServerWEB_API_Settings import app_API_Settings
app.register_blueprint(app_API_Settings)

# Home route
from .ServerWEB_Security import protect

@app.route('/')
@protect
def home():
    #get db cursor
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    #get name
    req = 'SELECT S_VALUE FROM Settings WHERE S_KEY="Name"'
    cursor.execute(req)
    name = cursor.fetchall()[0][0]  
    #close connection      
    cursor.close()
    cnx.close()
    #return home page (with name)
    return render_template("home.html", name=name)


@app.route("/RemoteAccess", methods=["POST","GET"])
def login():
    #If submit passwd to connect
    if request.method == "POST" and 'passwd' in request.form:
        cnx = cnxpool.get_connection()
        cursor = cnx.cursor()
        
        #hashing passwd
        hash_passwd = hashlib.sha1(bytes(request.form['passwd'], 'utf-8')).hexdigest()
        #checking if passwd is ok
        req = 'SELECT IF(S_VALUE=%s, TRUE, FALSE) FROM Settings WHERE S_KEY="Password"'
        
        cursor.execute(req, (hash_passwd,))
        result = cursor.fetchall()[0][0]
        
        #if password ok
        if result == 1:
            #declare connected and redirect to home
            session["connected"] = True
            return redirect(url_for("home"))
        else:
            # (bad passwd) return login page
            return render_template("connect.html")
        
        cursor.close()
        cnx.close()
    # If already connected
    elif "connected" in session and session["connected"]:
        #redirect to home
        return redirect(url_for("home"))
    # Else (method is get or form invalid and not connected)
    else:
        #return login page
        return render_template("connect.html")

# Run App
if __name__ == "__main__":
    app.run(host="192.168.1.30", port=80, debug=True, threaded=True)








