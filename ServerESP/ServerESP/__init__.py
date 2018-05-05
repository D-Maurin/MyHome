from flask import *

app = Flask(__name__)

from .ServerESP_DB import cnxpool

@app.route('/report_temp/<string:SID>/<int:temp>')
@app.route('/report_temp/<string:SID>/<float:temp>')
def report_temp(SID, temp):
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    cursor.callproc('report_temp', (SID, round(temp,1)))
    cursor.close()
    cnx.close()
    return "OK"

@app.route('/report_window/<string:WID>/<int:state>')
def report_temp(WID, state):
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    cursor.callproc('report_temp', (WID, state))
    cursor.close()
    cnx.close()
    return "OK"

@app.route('/get_temps/<string:RID>')
def get_temps(RID):
    cnx = cnxpool.get_connection()
    cursor = cnx.cursor()
    cursor.callproc('get_temps', args=(RID,))
    for i in cursor.stored_results():
        result = i.fetchall()
    cursor.close()
    cnx.close()
    return jsonify(result)

import sys
if __name__ == "__main__":
    s_host = sys.argv[1]
    s_port = int(sys.argv[2])
    app.run(host=s_host, port=s_port, debug=True)

