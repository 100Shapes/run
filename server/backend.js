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
                start_time:request.payload.start_time,
                team_id:request.payload.team_id,
            };
            server.methods.addRunner(runner, function(err, newRunner) {
                if (err) {
                    console.log(err);
                    if (err.errorType) {
                      reply("Runner Exists").code(409)
                    }
                } else {
                    reply(newRunner).code(201);
                }
            });
        },
        config: {
            validate: {
                payload: {
                    bid: Types.string().required().min(3),
                    name: Types.string().required().min(3),
                    start_time: Types.date(),
                    team_id: Types.string(),
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/teams',
        handler: function (request, reply) {
            server.methods.getTeams(function(err, teams) {
                if (err) {
                    console.log(err);
                } else {
                    reply(teams).code(200);
                }
            })
        }
    });

    server.route({
        method: 'POST',
        path: '/teams',
        handler: function (request, reply) {
            var team = {
                name: request.payload.name,
                desc:request.payload.desc,
            };
            server.methods.addTeam(team, function(err, newTeam) {
                if (err) {
                    console.log(err);
                } else {
                    reply(newTeam).code(200);
                }
            });
        },
        config: {
            validate: {
                payload: {
                    name: Types.string().required().min(3),
                    desc: Types.string().min(3),
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
                    reply(newLap).code(201);
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
        path: '/comps',
        handler: function (request, reply) {
            server.methods.getComps( function(err, comps) {
                if (err) {
                    console.log(err);
                } else {
                    reply(comps).code(200);
                }
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/comps',
        handler: function (request, reply) {
            var comp = {
              name: request.payload.name,
              laps: request.payload.laps,
              desc: request.payload.desc,
            };
            server.methods.addComp(comp, function(err, new_comp) {
                if (err) {
                    console.log(err);
                } else {
                    reply(new_comp).code(201);
                }
            });
        },
        config: {
            validate: {
                payload: {
                    name: Types.string().required().min(3),
                    laps: Types.number().integer(),
                    desc: Types.string(),
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/comps/current',
        handler: function (request, reply) {
            server.methods.getCurrentComp( function(err, current) {
                if (err) {
                    console.log(err);
                } else {
                    reply(current).code(200);
                }
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/comps/current',
        handler: function (request, reply) {
            server.methods.setCurrentComp(request.payload.comp_id, function(err, current) {
                if (err) {
                    console.log(err);
                } else {
                    reply(current).code(201);
                }
            });
        },
        config: {
            validate: {
                payload: {
                    comp_id: Types.string().required(),
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/comps/start',
        handler: function (request, reply) {
            server.methods.setCurrentStart(request.payload.start_time, function(err, current) {
                if (err) {
                    console.log(err);
                } else {
                    reply(current).code(201);
                }
            });
        },
        config: {
            validate: {
                payload: {
                    start_time: Types.number().integer(),
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

    server.route({
        method: 'GET',
        path: '/recents',
        handler: function (request, reply) {
            server.methods.getRecents( function(err, recent_runners) {
              if (err) {
                  console.log(err);
              } else {
                reply(recent_runners).code(200);
              }
            });
        }
    });
};
