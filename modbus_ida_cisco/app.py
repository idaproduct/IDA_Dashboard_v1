# Tawannnnnnnn :)
# Base file for IOx
# modbus_ida - app.py
# Webapp update checker.

import os
import time
import pyping

CURRENT_DIRECTORY = os.path.dirname(os.path.abspath(__file__))
REQ = os.path.join(CURRENT_DIRECTORY, "webapp" ,"req", "requirements.txt")
APPFILE = os.path.join(CURRENT_DIRECTORY, "webapp", "webapp.py")
def softwareUpdate():
    try:
        os.system('pip install -r ' + REQ)
    except:
        pass

if __name__ == '__main__':
    dropboxLoopChecker = True
    while dropboxLoopChecker == True:
        try:
            r = pyping.ping('www.github.com')
            if r.ret_code == 0:
                print("done")
                dropboxLoopChecker = False
            else:
                pass
        except:
            print("failed")
            time.sleep(5)
    softwareUpdate()
    os.system('python '+ APPFILE)
