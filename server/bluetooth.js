var noble = require('noble');
var _ = require('lodash');

var inRange = [];
var WINDOW = 5000;	 // milliseconds


module.exports = function(server) {

	server.method('getNearest', function (next) {
        nearest_devices = inRange;

        console.log(inRange, nearest_devices);

        
        // var device = {
        //             nearest.peripheral.uuid: uuid,
        //             nearest.peripheral.rssi: rssi
        //         }
        next(inRange);
    });



	function addLap(uuid){
		var lap = {
		    bid: uuid,
		    time: new Date()
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

