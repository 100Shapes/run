# Runner Tracker

An app to automatcially track runners and count laps. It uses Bluetooth Low Energy to sense runners and a mobile web app to display the data.

Designed to be run in the field on a RaspberryPi with a Bluetooth 4.0 dongle along with Bluetooth 4.0 tags attached to the runners.

## Stack

- [Noble](https://github.com/sandeepmistry/noble) for Bluetooth detection
- HAPI back-end with NEDB database
- Angular front-end

## Dependencies

1. `sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev`
2. `sudo setcap cap_net_raw+eip $(eval readlink -f which node)`

## Start

1. `npm install`
2. set ENVS `export STATION_ID=Test`
3. `npm start`
