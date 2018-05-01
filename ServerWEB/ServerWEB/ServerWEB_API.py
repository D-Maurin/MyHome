from flask import *

from .ServerWEB_DB import cnxpool
from .ServerWEB_Security import protect

# Extension creation
app_API = Blueprint("app_API", __name__)


# API routes
@app_API.route("/get_<string:cmd>")
@protect
def get_simply(cmd):
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    cursor.callproc("get_" + cmd)
    for i in cursor.stored_results():
        result = i.fetchall()
    cursor.close()
    cnx.close()
    return jsonify(result)

@app_API.route("/get_<string:cmd>/<int:gid>")
@protect
def get_by_gid(cmd, gid):
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    cursor.callproc("get_" + cmd, (gid,))
    for i in cursor.stored_results():
        result = i.fetchall()
    cursor.close()
    cnx.close()
    return jsonify(result)

@app_API.route("/set_target_temp/<int:gid>/<float:ttemp>")
@app_API.route("/set_target_temp/<int:gid>/<int:ttemp>")
@protect
def set_target_temp(gid, ttemp):
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    cursor.callproc("set_target_temp", (gid, ttemp))
    cursor.close()
    cnx.close()
    return "OK"

@app_API.route("/action_<string:cmd>/<int:gid>/<string:val>")
@protect
def action(cmd, gid, val):
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    cursor.callproc("action_" + cmd, (gid,val))
    cursor.close()
    cnx.close()
    return "OK"

@app_API.route("/add_room/<string:name>/<string:sid>")
def add_room(sid, name):
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    gid = cursor.callproc("add_room", (name, sid, None))[2]
    cursor.close()
    cnx.close()
    return jsonify(gid)

@app_API.route("/del_room/<string:gid>")
def del_room(gid):
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    cursor.callproc("del_room", (gid,))
    cursor.close()
    cnx.close()
    return "OK"

@app_API.route("/del_module_<string:module>/<string:id>")
def del_module(module, id):
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    cursor.callproc("del_module_" + module, (id,))
    cursor.close()
    cnx.close()
    return "OK"
    
    