# modbus_ida
<br>
<p align="center">
    <img src="/webapp/static/images/platelet.gif" width="700" height="394">
  <h3 align="center">Status: ongoing</h3>
</p>

"<b>The IDA Platform - Phase 1</b> (Industrial IoT and Data Analytics Platform) is a platform that collects energy consumption data from factory" - <i>National Electronics and Computer Technologies Center, 2020</i>

## Details
### Requirements (requirements.txt)
* Python v2.7
* Flask
* win-inet-pton
* requests
* pymodbusTCP
* flask-login
```sh
pip install -r requirements.txt
```
### Current Structure
```
modbus_ida
├── /static
      ├── css
      └── images
├── /templates
├── app.py
├── dockerfile
└── package.yaml (Cisco IOx)
```
