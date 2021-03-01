#!/usr/bin/env python

from pyModbusTCP.client import ModbusClient
import time
import json
import requests

SERVER_HOST = "localhost"
SERVER_PORT = 1234
url = 'https://api.netpie.io/v2/device/shadow/data'

c = ModbusClient()

# uncomment this line to see debug message
#c.debug(True)

# define modbus server host, port
c.host(SERVER_HOST)
c.port(SERVER_PORT)

basicAuthCredentials = ('42192c3c-f697-4383-9f7a-e810fc6f1c25', '6dHk1SjB2qzzxg7oGnZcYSyPaEVHse8Y')
response = requests.get(url, auth=basicAuthCredentials)

while True:
    # open or reconnect TCP to server
    if not c.is_open():
        if not c.open():
            print("unable to connect to "+SERVER_HOST+":"+str(SERVER_PORT))

    # if open() is ok, read register (modbus function 0x03)
    if c.is_open():
        # read 10 registers at address 0, store result in regs list
        regs = c.read_holding_registers(10, 10)
        # if success display registers
        if regs:
            print("reg ad #0 to 9: "+str(regs))

        #Convert to JSON
            data_shadow = json.dumps({"data":{"reg0": regs[0], "reg1": regs[1], "reg2": regs[2], "reg3": regs[3], "reg4": regs[4], "reg5": regs[5]}})
            payload = json.loads(data_shadow)
            print(data_shadow)
            print(response.text)
            requests.post(url,data=data_shadow, auth=basicAuthCredentials, timeout=2)
            

    time.sleep(10)
