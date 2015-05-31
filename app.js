var noble = require('noble');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var rc = require('./controllers/race_controller')

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var ua = require('universal-analytics');

var visitor = ua('UA-27923958-9');

var app = express();



noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([],true);
  } else {
    noble.stopScanning([],true);
  }
});

var RSSI_THRESHOLD    = -90;
var EXIT_GRACE_PERIOD = 2000; // milliseconds
var inRange = [];

noble.on('discover', function(peripheral) {
  if (peripheral.rssi < RSSI_THRESHOLD) {
    // ignore
    return;
  }

  var uuid = peripheral.uuid;
  var entered = !inRange[uuid];

  if (entered) {
    inRange[uuid] = {
      peripheral: peripheral
    };

    console.log('sending event', peripheral.uuid, new Date().getTime());
    visitor.event({
        ec:'Runner Tracking',
        ea:'Runner Passed',
        el: peripheral.uuid,
        ev: new Date().getTime()
    }, function (err) {
        if (err){console.log(err)};
    });

    console.log('"' + peripheral.advertisement.localName + '" entered (RSSI ' + peripheral.rssi + ') ' + new Date());
  }

  inRange[uuid].lastSeen = Date.now();
});

setInterval(function() {
  for (var uuid in inRange) {
    if (inRange[uuid].lastSeen < (Date.now() - EXIT_GRACE_PERIOD)) {
      var peripheral = inRange[uuid].peripheral;

      console.log('"' + peripheral.advertisement.localName + '" exited (RSSI ' + peripheral.rssi + ') ' + new Date());

      delete inRange[uuid];
    }
  }
}, EXIT_GRACE_PERIOD / 2);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/admin', admin);
app.use('/users', users);

module.exports = app;
