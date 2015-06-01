var noble = require('noble');
var backend = require('./backend');


function addLap (bid) {
	backend.addLap(bid, function(err, newLap){
		if (err) {
			console.log(err);
		} else {
			//
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

var inRange = [];

var WINDOW = 5000; // milliseconds

noble.on('discover', function(peripheral) {

  	var uuid = peripheral.uuid;

  	if (!inRange[uuid]) {
		inRange[uuid] = {
	  		peripheral: peripheral
		};
		addLap(uuid);
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

