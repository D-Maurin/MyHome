from flask import *
from functools import wraps
import ipaddress as ip
import sys

#Décrorateur executé avant chaque requête le possédant (@protect)
#Protège le serveur des requêts hors réseau local avec un mot de passe 
def protect(route):
    @wraps(route)
    def protected(*args, **kwargs):
        ## Allow Access ...
        # ... to Local Ip
        if ip.ip_address(request.remote_addr).is_private:
            return route(*args, **kwargs)
        
        # ... to Connected User
        if "connected" in session and session["connected"]:
            return route(*args, **kwargs)
        
        sys.stderr.write('\x1b[31m{}\n\x1b[0m'.format("Unauthorized access from " + request.remote_addr))
        
        ## Else Refuse Access
        # ... if user accessing to API (js/xhr)
        if request.blueprint == "app_API":
            abort(403)
            return None
        # Else if user ask for home page
        return redirect(url_for("login"))
    return protected
