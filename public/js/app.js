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

rta.controller('adminController', ['$scope', 'dataFactory', function($scope, dataFactory) {
  dataFactory.getRunners().success(function (runners) {
    $scope.runners = runners;
  })

  dataFactory.getLaps().success(function (laps) {
    $scope.laps = laps;
  })

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

    dataFactory.getTop = function (top) {
        return $http.get(urlBase + 'top');
    };

    return dataFactory;
}]);

