var rta = angular.module('runApp', []);

rta.controller('indexController', ['$scope', '$interval', 'dataFactory', function($scope, $interval, dataFactory) {

  dataFactory.getCurrentComp().success(function(comp) {
    $scope.comp = comp;
  })

  $interval(function() {

    dataFactory.getTop().success(function(top) {
      top.forEach(function(runner) {
        dataFactory.getLastLapByID(runner.bid).success(function(lastlap) {
          runner.lastlap = lastlap
        })
      });
      $scope.top = top;
    })

  }, 1000, 1);

  $scope.getTimes = function(n) {
    return new Array(n);
  };

  $interval(function() {

  }, 500, 1);


}]);

rta.controller('adminController', ['$scope', '$interval', 'dataFactory', function($scope, $interval, dataFactory) {

  update_all();

  $scope.new_runner = {};
  $scope.current_comp = {};

  $scope.set_current = function(new_current) {
    dataFactory.setCurrentComp(new_current)
    $scope.current_comp = new_current
    update_all()
  }

  $scope.add_comp = function() {
    dataFactory.addComp($scope.new_comp)
  }

  $scope.add = function(runner) {
    runner.rssi = undefined;
    dataFactory.addRunner(runner)
      .success(function(newRunner) {
        $scope.message = "Runner " + newRunner.name + " Added";
      })
      .error(function(data, status, headers, config) {
        if (status == 409) {
          $scope.message = "Runner exists: " + data.bid + " " + data.name;
        } else {
          console.log(data);
        }
      });
  };

  function update_all() {
    update_runners();
    dataFactory.getComps().success(function(comps) {
      $scope.comps = comps;
    })

    dataFactory.getTeams().success(function(teams) {
      $scope.teams = teams;
    })
  }

  dataFactory.getCurrentComp().success(function(current) {
    $scope.current_comp = current;
  })

  $interval(function() {

    update_runners();

    dataFactory.getNearest().success(function(nearest_device) {
      $scope.new_runner.bid = nearest_device.bid;
      $scope.new_runner.rssi = nearest_device.rssi;
    })
    console.log('running...');
  }, 200);

  function update_runners() {
    dataFactory.getRunners().success(function(runners) {
      $scope.runners = runners;
    }).error(function(data, status, headers, config) {
      console.log(data);
    });
  }

}]);

rta.controller('teamController', ['$scope', '$interval', 'dataFactory', function($scope, $interval, dataFactory) {

  update_teams();

  $scope.new_team = {};

  $scope.add = function(team) {
    dataFactory.addTeam(team)
      .success(function(newTeam) {
        $scope.message = "Team " + newTeam.name + " Added";
        $scope.new_team = {}
      })
      .error(function(data, status, headers, config) {
        if (status = 400) {
          $scope.message = "Team exists: " + data.name;
        } else {
          console.log(data);
        }
      });
  };

  $interval(function() {
    update_teams();
  }, 500);

  function update_teams() {
    dataFactory.getTeams().success(function(teams) {
      $scope.teams = teams;
    })
  }

}]);

rta.controller('compController', ['$scope', '$interval', 'dataFactory', function($scope, $interval, dataFactory) {

  update_comps();

  $scope.new_comp = {};

  $scope.add = function(comp) {
    console.log(comp)
    dataFactory.addComp(comp)
      .success(function(newComp) {
        $scope.message = "Competition " + newComp.name + " Added";
        $scope.new_comp = {}
      })
      .error(function(data, status, headers, config) {
        if (status = 400) {
          $scope.message = "Team exists: " + data.name;
        } else {
          console.log(data);
        }
      });
  };

  $interval(function() {
    update_comps();
  }, 500);

  function update_comps() {
    dataFactory.getComps().success(function(comps) {
      $scope.comps = comps;
    })
  }

}]);





rta.factory('dataFactory', ['$http', function($http) {

  var urlBase = '/';
  var dataFactory = {};

  dataFactory.getRunners = function() {
    return $http.get(urlBase + 'runners');
  };

  dataFactory.getRunnerByID = function(bid) {
    return $http.get(urlBase + 'runners?bid=' + bid);
  };

  dataFactory.addRunner = function(runner) {
    if (runner.team) {
      runner.team_id = runner.team._id;
      delete runner.team
    }
    return $http.post(urlBase + 'runners', runner);
  };

  dataFactory.getTeams = function(teams) {
    return $http.get(urlBase + 'teams')
  };

  dataFactory.addTeam = function(team) {
    return $http.post(urlBase + 'teams', team)
  };

  dataFactory.getComps = function() {
    return $http.get(urlBase + 'comps')
  };

  dataFactory.getCurrentComp = function() {
    return $http.get(urlBase + 'comps/current')
  };

  dataFactory.setCurrentComp = function(comp) {
    return $http.post(urlBase + 'comps/current', {
      "comp_id": comp._id
    })
  };

  dataFactory.addComp = function(comp) {
    return $http.post(urlBase + 'comps', comp)
  };

  dataFactory.getLaps = function() {
    return $http.get(urlBase + 'laps')
  };

  dataFactory.getLapsByID = function(bid) {
    return $http.get(urlBase + 'laps?bid=' + bid);
  };

  dataFactory.getLastLapByID = function(bid) {
    return $http.get(urlBase + 'lastlap?bid=' + bid);
  };

  dataFactory.addLaps = function(lap) {
    return $http.post(urlBase + 'laps', lap);
  };

  dataFactory.getTop = function() {
    return $http.get(urlBase + 'top');
  };

  dataFactory.getNearest = function() {
    return $http.get(urlBase + 'nearest');
  };

  return dataFactory;
}]);
