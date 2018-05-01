from flask import *
from functools import wraps
import ipaddress as ip
import sys
import plyer

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
        
        plyer.notification.notify(title="Unauthorized access", message=request.remote_addr, app_name="Server WEB", timeout=3600)
        ## Else Refuse Access
        if request.blueprint == "app_API":
            abort(403)
            return None
        return redirect(url_for("login"))
    return protected
