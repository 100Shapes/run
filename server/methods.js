var Types = require('joi');
var _ = require('lodash');

var ua = require('universal-analytics');
var visitor = ua('UA-27923958-9');

var Datastore = require('nedb');
db = {};
db.runners = new Datastore({
  filename: 'db/runners',
  autoload: true
});
db.laps = new Datastore({
  filename: 'db/laps',
  autoload: true
});
db.comps = new Datastore({
  filename: 'db/comp',
  autoload: true
});
db.teams = new Datastore({
  filename: 'db/teams',
  autoload: true
});

// db.runners.ensureIndex({ fieldName: 'bid', unique: true }, function (err) {
// });

module.exports = function(server) {

  db.comps.findOne({
    current: true
  }, function(err, current) {
    if (current) {
      server.app.start_time = current.start_time
      server.app.current = current._id
      console.log('Current Comp:', current.name)
    } else {
      console.log('No Current Comp, Set in admin')
    }

  });

  server.method('getRunners', function(next) {
    db.runners.find({
      comp_id: server.app.current
    }, next);
  });

  server.method('getRunnerByID', function(bid, next) {
    db.runners.findOne({
      bid: bid,
      comp_id: server.app.current
    }, next);
  });

  server.method('addRunner', function(runner, next) {
    runner.comp_id = server.app.current
    db.runners.insert(runner, next);
  });

  server.method('addTeam', function(team, next) {
    team.comp_id = server.app.current
    db.teams.insert(team, next);
  });

  server.method('getTeams', function(next) {
    db.teams.find({
      comp_id: server.app.current
    }, next);
  });

  // server.method('addRunnerToTeam', function (runner_id, team_id, next) {
  //     db.teams.update({ _id : team_id }, { $push: { runners: runner_id } }, next);
  // });

  server.method('getLaps', function(next) {
    db.laps.find({
      comp_id: server.app.current
    }, next);
  });

  server.method('getLapsByID', function(bid, next) {
    db.laps.find({
      bid: bid,
      comp_id: server.app.current
    }, next);
  });

  server.method('getLastLapByID', function(bid, next) {
    db.laps.findOne({
      bid: bid,
      comp_id: server.app.current
    }).sort({
      time: -1
    }).exec(next);
  });

  server.method('addLap', function(lap, next) {
    time = new Date()
    current_time = time.getTime()

    if (server.app.start_time && current_time > server.app.start_time) {
      lap.comp_id = server.app.current;
      db.runners.update({
        bid: lap.bid,
        comp_id: server.app.current
      }, {
        $inc: {
          laps: 1
        }
      }, {})
      db.laps.insert(lap, next);
    } else {
      console.log("Comp not started");
    }

    // db.laps.findOne({ bid: lap.bid, comp_id : server.app.current }).sort({ time: -1 }).exec(function (err, lastlap) {
    //   if (lastlap) {
    //     lap.diff =  lap.time - lastlap.time
    //     console.log("diff:", lap.diff);
    //     if (lap.diff > (2 * 60 * 1000)) {
    //       lap.comp_id = server.app.current
    //       db.laps.insert(lap, next);
    //     } else {
    //       console.log("time infingment:", lap.diff, lap.bid);
    //     }
    //   } else {
    //       lap.diff = 0
    //       db.laps.insert(lap, next);
    //   }
    // })
  });

  server.method('getComp', function(comp_id, next) {
    db.comps.findOne({
      _id: comp_id
    }, next);
  });

  server.method('getComps', function(next) {
    db.comps.find({}, next);
  });

  server.method('addComp', function(comp, next) {
    db.comps.insert(comp, next);
  });

  server.method('getCurrentComp', function(next) {
    db.comps.findOne({
      current: true
    }, function(err, current) {
      server.app.current = current._id
      next(err, current)
    });
  });

  server.method('setCurrentComp', function(comp_id, next) {
    server.app.current = comp_id
    db.comps.update({
      current: true
    }, {
      $unset: {
        current: true
      }
    })
    db.comps.update({
      _id: comp_id
    }, {
      $set: {
        current: true
      }
    }, next)
  });

  server.method('setCurrentStart', function(start_time, next) {
    server.app.start_time = start_time
    db.laps.remove({
      comp_id: server.app.current
    },{ multi: true })
    db.runners.update({ comp_id: server.app.current
    }, {
      $set: {
        laps: 0
      }
    },{ multi: true })
    db.comps.update({
      _id: server.app.current
    }, {
      $set: {
        'start_time': server.app.start_time
      }
    }, next)
  });

  server.method('getTop', function(next) {
    var top = [];
    db.runners.find({
      comp_id: server.app.current
    }, function(err, runners) {
      _.forEach(runners, function(runner, i) {
        db.laps.find({
          bid: runner.bid,
          comp_id: server.app.current
        }, function(err, laps) {
          if (laps) {
            top.push({
              name: runner.name,
              laps: laps.length,
              bid: runner.bid
            })
          }
          if (i == runners.length - 1) {
            top = _.sortBy(top, 'laps').reverse();
            next(top);
          }
        })
      })
    })
  });

  server.method('logLap', function(lap) {
    visitor.event({
      ec: 'Runner Tracking',
      ea: 'Runner Passed',
      el: lap.time,
      ev: lap.bid
    }, function(err) {
      if (err) {
        console.log(err)
      };
    });
  });

  server.method('getRecents', function(next) {
    var recents = [];
    db.laps.find({
      comp_id: server.app.current
    }).sort({
      time: 1
    }).limit(15).projection({
      bid: 1,
      _id: 0
    }).exec(function(err, recent_laps) {
      db.runners.find({
        $or: recent_laps,
        comp_id: server.app.current
      }, next)
    })
  })
};
