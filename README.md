#Runner Tracker
##A simple app to track runners and count number of laps.

- HAPI backend
- NEDB database
- Noble bluetooth detection
- Angular Frontend

Designed to be run remotely on a PI with a bluetooth 4.0 dongle + Bluetooth 4.0 tags on runners.

to run:

## if on linux/Pi:

1. `sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev`
2. `sudo setcap cap_net_raw+eip $(eval readlink -f which node)`

## all:

1. `npm install`
2. set ENVS `export STATION_ID=Test`
3. `npm start`
