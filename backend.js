var Types = require('Joi');

var ua = require('universal-analytics');
var visitor = ua('UA-27923958-9');

var Datastore = require('nedb');
db = {};
db.runners = new Datastore({ filename: 'db/runners', autoload: true });
db.laps = new Datastore({ filename: 'db/laps', autoload: true });

module.exports = [{
    method: 'GET',
    path: '/runners',
    config: {
        handler: getRunners
    }
}, {
    method: 'POST',
    path: '/runners',
    config: {
        handler: addRunner,
        validate: {
            payload: {
                bid: Types.string().required().min(3),
                name: Types.string().required().min(3),
                start_time: Types.date(),
                team: Types.string()
            }
        }
    }
}, {
    method: 'GET',
    path: '/laps',
    config: {
        handler: getLaps
    }
}, {
    method: 'POST',
    path: '/laps',
    config: {
        handler: addLapRequest,
        validate: {
            payload: {
                bid: Types.string().required().min(3),
            }
        }
    }
}];

module.exports.addLap = function addLap(bid, callback){
    var lap = {
        bid: bid,
        time: new Date()
    };
    db.laps.insert(lap, callback);
    visitor.event({
        ec:'Runner Tracking',
        ea:'Runner Passed',
        el: lap.time,
        ev: lap.bid
    }, function (err) {
        if (err){console.log(err)};
    });
}

function getRunners(request) {
    if (request.query.bid) {
        getRunner(request)
    } else {
        db.runners.find({}, function (err, runners) {
            if (err) {
                console.log(err);
            } else {
                request.reply(runners).code(200);
            }
        });
    } 
}

function getRunner(request) {
    db.runners.findOne({ bid: request.query.bid }, function (err, runner) {
        if (err) {
            console.log(err);
        } else {
            request.reply(runner);
        }
    });
}

function addRunner(request) {
    var runner = {
        bid: request.payload.bid,
        name: request.payload.name,
        start_time:request.payload.team,
        team:request.payload.team
    };

    db.runners.insert(runner, function (err, newRunner) {
        if (err) {
            console.log(err);
        } else {
            request.reply(newRunner).code(200);
        }
    });
}

function getLaps(request) {
    db.laps.find({}, function (err, laps) {
      if (err) {
            console.log(err);
        } else {
            request.reply(laps).code(200);
        }
    });
}

function addLapRequest(request) {
    exports.addLap(bid, function(err, newLap){
        if (err) {
            console.log(err);
        } else {
            request.reply(newLap).code(200);
        }
    });   
}