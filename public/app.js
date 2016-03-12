(function(){
  /*
  var app = angular.module('nhacks',['ui.router', 'ngRoute']);

  app.config(function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "login.html",
        controller: "IndexCtrl"
      });

    $locationProvider.html5Mode(true);
  });
*/

  var app = angular.module('nhacks',['ui.router']);

  app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
      .state('home', {
        url:'/',
        templateUrl: '/index.html',
        controller: "FoodSearchCtrl"
      });

      $urlRouterProvider.otherwise('home');
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
  app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  });

//////////////////////////////////////////////////////////////////////////////////////
 app.controller('IndexCtrl', function($rootScope, $scope, $routeParams, $http){
    //$scope.trip = trip;


  });

  app.controller('FoodSearchCtrl', function($scope, $http){

    $scope.results = null;
    $scope.foodSearch = function() {
      var url = 'http://cors.io?u=http://www.food2fork.com/api/search?key=529cd164050b80734aff7a59a2f7a0a3&q=salmon';

/*
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
      }).done(function(response) {
        console.log(response);
        $scope.results = response;
      });
      */

      $http({
        url: url,
        method: 'GET'
      }).then(function(response) {
        //console.log(response.status);
        //console.log(res.data);
        $scope.results = response;
      }, function(response) {
        console.log(response.body);
      }); 

    };
  });


})()