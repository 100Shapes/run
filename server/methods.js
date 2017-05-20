var Types = require('joi');
var _ = require('lodash');

var ua = require('universal-analytics');
var visitor = ua('UA-27923958-9');

var Datastore = require('nedb');
db = {};
db.runners = new Datastore({ filename: 'db/runners', autoload: true });
db.laps = new Datastore({ filename: 'db/laps', autoload: true });

module.exports = function(server) {

    server.method('getRunners', function (next) {
        db.runners.find({ }, next);
    });

    server.method('getRunnerByID', function (bid, next) {
        db.runners.findOne({ bid: bid }, next);
    });

    server.method('addRunner', function (runner, next) {
        db.runners.insert(runner, next);
    });

    server.method('getLaps', function (next) {
        db.laps.find({ }, next);
    });

    server.method('getLapsByID', function (bid, next) {
        db.laps.find({ bid: bid }, next);
    });

    server.method('getLastLapByID', function (bid, next) {
        db.laps.findOne({ bid: bid }).sort({ time: -1 }).exec(next);
    });

    server.method('addLap', function (lap, next) {
      db.laps.findOne({ bid: lap.bid }).sort({ time: -1 }).exec(function (err, lastlap) {
        if (lastlap) {
          lap.diff =  lap.time - lastlap.time
          console.log("diff:", lap.diff);
          if (lap.diff > (2 * 60 * 1000)) {
            db.laps.insert(lap, next);
          } else {
            console.log("time infingment:", lap.diff, lap.bid);
          }
        } else {
            lap.diff = 0
            db.laps.insert(lap, next);
        }
      })
    });

    server.method('getTop', function (next) {
        var top = [];
        db.runners.find({ }, function(err, runners) {
            _.forEach(runners, function(runner, i) {
                db.laps.find({ bid: runner.bid }, function(err, laps) {
                    if (laps) {
                        top.push({
                            name: runner.name,
                            laps: laps.length,
                            bid: runner.bid
                        })
                    }
                    if (i == runners.length-1) {
                        top = _.sortBy(top, 'laps').reverse();
                        next(top);
                    }
                })
            })
        })
    });

    server.method('logLap', function (lap) {
        visitor.event({
            ec:'Runner Tracking',
            ea:'Runner Passed',
            el: lap.time,
            ev: lap.bid
        }, function (err) {
            if (err){console.log(err)};
        });
    });
};
