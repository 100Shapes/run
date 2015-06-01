var Types = require('hapi').types;

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
        handler: getRunners,
        validate: {
            payload: {
                bid: Types.String()
            }
        }
    }
}, {
    method: 'POST',
    path: '/runners',
    config: {
        handler: addRunner,
        payload: 'parse',
        validate: {
            payload: {
                bid: Types.String().required().min(3),
                name: Types.String().required().min(3),
                team: Types.String()
            }
        }
    }
}, {
    method: 'GET',
    path: '/laps',
    config: {
        handler: getLaps,
        payload: 'parse',
        validate: {
            payload: {
                bid: Types.String().required().min(3)
            }
        }
    }
}, {
    method: 'POST',
    path: '/laps',
    config: {
        handler: addLap,
        payload: 'parse',
        validate: {
            payload: {
                bid: Types.String().required().min(3),
            }
        }
    }
}];

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
    // var runner = runners.filter(function(p) {
    //     return p.id === parseInt(request.params.id);
    // }).pop();

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

function addLap(request) {
    var lap = {
        bid: request.payload.bid,
        time: new Date()
    };
    visitor.event({
        ec:'Runner Tracking',
        ea:'Runner Passed',
        el: lap.bid,
        ev: lap.time
    }, function (err) {
        if (err){console.log(err)};
    });

    db.laps.insert(lap, function (err, newLap) {
        if (err) {
            console.log(err);
        } else {
            request.reply(newLap).code(200);
        }
    });

    
}