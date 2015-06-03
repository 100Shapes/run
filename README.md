A simple app to track runners and count number of laps.

- HAPI backend
- NEDB database
- Noble bluetooth detection
- Angular Frontend

Designed to be run remotely on a PI with a bluetooth 4.0 dongle + Bluetooth 4.0 tags on runners.

to run:

if on linux/Pi:
    - sudo apt-get install bluetooth bluez-utils libbluetooth-dev

all:
    - npm install
    - npm start