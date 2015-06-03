var noble = require('noble');

var inRange = [];
var WINDOW = 5000;	 // milliseconds


module.exports = function(server) {

	function addLap(uuid){
		var lap = {
		    bid: uuid,
		    time: new Date()
		}
		server.methods.logLaps(lap);
		server.methods.addLaps(lap, function(err, newLap) {
		    if (err) {
		        console.log(err);
		    } else {
		        reply(newLap).code(200);
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

