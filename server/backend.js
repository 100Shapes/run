var Types = require('joi');
var _ = require('lodash');

module.exports = function(server) {
    server.route({
        method: 'GET',
        path: '/runners',
        handler: function (request, reply) {
            if (request.query.bid) {
                server.methods.getRunnerByID(request.query.bid, function(err, runner) {
                    if (err) {
                        console.log(err);
                    } else {
                        reply(runner).code(200);
                    }
                });
            } else {
                server.methods.getRunners( function(err, runners) {
                    if (err) {
                        console.log(err);
                    } else {
                        reply(runners).code(200);
                    }
                });
            }
        },
        config: {
            validate: {
                query: {
                    bid: Types.string()
                }
            }
        }

    });

    server.route({
        method: 'POST',
        path: '/runners',
        handler: function (request, reply) {
            var runner = {
                bid: request.payload.bid,
                name: request.payload.name,
                start_time:request.payload.team,
                team:request.payload.team
            };
            server.methods.addRunner(runner, function(err, newRunner) {
                if (err) {
                    console.log(err);
                } else {
                    reply(newRunner).code(200);
                }
            });
        },
        config: {
            validate: {
                payload: {
                    bid: Types.string().required().min(3),
                    name: Types.string().required().min(3),
                    start_time: Types.date(),
                    team: Types.string()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/laps',
        handler: function (request, reply) {
            if (request.query.bid) {
                server.methods.getLapsByID(request.query.bid, function(err, laps) {
                    if (err) {
                        console.log(err);
                    } else {

                        reply(laps).code(200);
                    }
                });
            } else {
                server.methods.getLaps( function(err, laps) {
                    if (err) {
                        console.log(err);
                    } else {
                        reply(laps).code(200);
                    }
                });
            }
        },
        config: {
            validate: {
                query: {
                    bid: Types.string()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/laps',
        handler: function (request, reply) {
            var lap = {
                bid: request.payload.bid,
                time: new Date()
            };
            server.methods.logLap(lap);
            server.methods.addLap(lap, function(err, newLap) {
                if (err) {
                    console.log(err);
                } else {
                    reply(newLap).code(200);
                }
            });
        },
        config: {
            validate: {
                payload: {
                    bid: Types.string().required().min(3)
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/lastlap',
        handler: function (request, reply) {
            server.methods.getLastLapByID(request.query.bid, function(err, lastlap) {
                if (err) {
                    console.log(err);
                } else {
                    reply(lastlap).code(200);
                }
            });
        },
        config: {
            validate: {
                query: {
                    bid: Types.string().required().min(3)
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/top',
        handler: function (request, reply) {
            server.methods.getTop( function(top) {
                reply(top).code(200);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/nearest',
        handler: function (request, reply) {
            server.methods.getNearest( function(nearest_devices) {
                reply(nearest_devices).code(200);
            });
        }
    });
};