var noble = require('noble');
var _ = require('lodash');

var inRange = [];
var WINDOW = 5000;	 // milliseconds


module.exports = function(server) {

	server.method('getNearest', function (next) {
        var nearest_devices = [];

		for (var key in inRange) {
		    if (inRange.hasOwnProperty(key)) {
		      nearest_devices.push(inRange[key].peripheral);
		    }
		}

		if (nearest_devices.length > 0) {
			nearest_devices = _.sortBy(nearest_devices, function(n) {
			  return Math.min(n.rssi);
			});
	        var device = {
	                    bid: nearest_devices[0].uuid,
	                    rssi: nearest_devices[0].rssi
	                }
	        next(device);
		} else {
			next();
		}

    });



	function addLap(uuid){
		var lap = {
		    bid: uuid,
		    time: new Date(),
			station: server.app.station_id
		}
		server.methods.logLap(lap);
		server.methods.addLap(lap, function(err, newLap) {
		    if (err) {
		        console.log(err);
		    } else {
		        console.log(newLap);
		    }
		});
	}

    noble.on('stateChange', function(state) {
	 	if (state === 'poweredOn') {
			noble.startScanning([],true);
	  	} else {
			noble.stopScanning([],true);
	  	}
	});

	noble.on('discover', function(peripheral) {

	  	var uuid = peripheral.uuid;

	  	if (!inRange[uuid]) {
			inRange[uuid] = {
		  		peripheral: peripheral
			};
			addLap(uuid)
		}
	  	inRange[uuid].lastSeen = Date.now();
	  	inRange[uuid].peripheral.rssi = peripheral.rssi;
	});

	setInterval(function() {
	  	for (var uuid in inRange) {

	  		console.log (inRange[uuid].peripheral.rssi, inRange[uuid].peripheral.uuid);

	  		if (inRange[uuid].lastSeen < (Date.now() - WINDOW)) {
	  			console.log ('out of window', uuid);

	  			delete inRange[uuid];
	  		}

	  	}
	}, WINDOW/10);
};

