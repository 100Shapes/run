var Types = require('hapi').types;

module.exports = [{
    method: 'GET',
    path: '/runners',
    config: {
        handler: getRunners,
        validate: {
            payload: {
                id: Types.String()
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
                id: Types.String().required().min(3),
                name: Types.String().required().min(3)
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
                id: Types.String().required().min(3)
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
                id: Types.String().required().min(3),
            }
        }
    }
}];

var laps = [];
var runners = [];

function getRunners(request) {
    if (request.query.id) {
        request.reply(getRunner(request.query.id));
    }
    else {
        request.reply(runners);
    } 
}

function getRunner(request) {
    var runner = runners.filter(function(p) {
        return p.id === parseInt(request.params.id);
    }).pop();

    request.reply(runner);
}

function addRunner(request) {
    var runner = {
        id: request.payload.id,
        name: request.payload.name,
    };

    runners.push(runner);
    request.reply(runner).code(200);
}

function getLaps(request) {
    request.reply(laps);
}

function addLap(request) {
    var lap = {
        id: request.payload.id,
        time: new Date()
    };

    laps.push(lap);
    request.reply(lap).code(200);
}