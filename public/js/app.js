var rta = angular.module('runApp',[]);

rta.controller('indexController', ['$scope', '$interval', 'dataFactory', function($scope, $interval, dataFactory) {

  $interval(function(){

    dataFactory.getTop().success(function (top) {
        top.forEach(function(runner){
            dataFactory.getLastLapByID(runner.bid).success(function (lastlap) {
              runner.lastlap = lastlap
            })
        });
      $scope.top = top;
    })

  },1000, 1);

  $scope.getTimes=function(n){
       return new Array(n);
  };

  $interval(function(){

  },1000, 1);


}]);

rta.controller('adminController', ['$scope', '$interval', 'dataFactory', function($scope, $interval, dataFactory) {

  update_runners();

  $scope.new_runner = {};
  $scope.current_comp = {};

  dataFactory.getComps().success(function (comps) {
    $scope.comps = comps;
  })

  $scope.add_comp = function () {
    dataFactory.addComp($scope.new_comp)
  }

  $scope.set_comp = function() {
    dataFactory.setComp($scope.current_comp)
}

  $scope.add = function(runner) {
    runner.rssi = undefined;
    dataFactory.addRunner(runner)
      .success(function (newRunner) {
        $scope.message = "Runner " + newRunner.name + " Added";
      })
      .error(function(data, status, headers, config) {
        if (status = 400){
         $scope.message = "Runner exists: " + data.bid + " " + data.name;
        } else {
         console.log(data);
        }
      });
  };

  $interval(function(){

    update_runners();

    dataFactory.getNearest().success(function (nearest_device) {
      $scope.new_runner.bid = nearest_device.bid;
      $scope.new_runner.rssi = nearest_device.rssi;
    })
    console.log('running...');
  },500);

  function update_runners() {
    dataFactory.getRunners().success(function (runners) {
      $scope.runners = runners;
    }).error(function(data, status, headers, config) {
        console.log(data);
    });
  }

}]);




rta.factory('dataFactory', ['$http', function($http) {

    var urlBase = '/';
    var dataFactory = {};

    dataFactory.getRunners = function () {
        return $http.get(urlBase + 'runners');
    };

    dataFactory.getRunnerByID = function (bid) {
        return $http.get(urlBase + 'runners?bid=' + bid);
    };

    dataFactory.addRunner = function (runner) {
        return $http.post(urlBase + 'runners', runner);
    };

    dataFactory.getComps = function () {
        return $http.get(urlBase + 'comps')
    };

    dataFactory.setComp = function (comp) {
        return $http.post(urlBase + 'comps/set', comp)
    };

    dataFactory.addComp = function () {
        return $http.post(urlBase + 'comps')
    };

    dataFactory.getLaps = function () {
        return $http.get(urlBase + 'laps')
    };

    dataFactory.getLapsByID = function (bid) {
        return $http.get(urlBase + 'laps?bid=' + bid);
    };

    dataFactory.getLastLapByID = function (bid) {
        return $http.get(urlBase + 'lastlap?bid=' + bid);
    };

    dataFactory.addLaps = function (lap) {
        return $http.post(urlBase + 'laps', lap);
    };

    dataFactory.getTop = function () {
        return $http.get(urlBase + 'top');
    };

    dataFactory.getNearest = function () {
        return $http.get(urlBase + 'nearest');
    };

    return dataFactory;
}]);
