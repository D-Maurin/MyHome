#debug test server launcher (not executed by apache)
from ServerWEB import app
app.run(host="192.168.137.1", port=80, debug=True, threaded=True)