var rta = angular.module('runApp',[]);

rta.controller('indexController', ['$scope', '$interval', 'dataFactory', function($scope, $interval, dataFactory) {

  $interval(function(){

    dataFactory.getTop().success(function (top) {
      $scope.top = top;
    })

  },1000);

  $scope.getTimes=function(n){
       return new Array(n);
  };



}]);

rta.controller('adminController', ['$scope', '$interval', 'dataFactory', function($scope, $interval, dataFactory) {

  update_runners();

  $scope.new_runner = {};

  $scope.add = function(runner) {
    dataFactory.addRunner(runner).success(function (newRunner) {
      $scope.message = "Runner " + newRunner.name + " Added";
      update_runners();
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

    dataFactory.getNearest().success(function (nearest_device) {
      $scope.new_runner.bid = nearest_device.bid;
      $scope.new_runner.rssi = nearest_device.rssi;
    })

  },400);

  function update_runners() {
    dataFactory.getRunners().success(function (runners) {
      $scope.runners = runners;
    })

    dataFactory.getLaps().success(function (laps) {
      $scope.laps = laps;
    })
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

    dataFactory.getLaps = function () {
        return $http.get(urlBase + 'laps')
    };

    dataFactory.getLapsByID = function (bid) {
        return $http.get(urlBase + 'laps?bid=' + bid);
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

