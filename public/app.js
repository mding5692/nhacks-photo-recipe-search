(function(){
  var app = angular.module('nhacks',['ui.router', 'ngRoute']);

  app.config(function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "landing.html",
        controller: "IndexCtrl"
      })
      .when("/login", {
        templateUrl: "login.html",
        controller: "IndexCtrl"
      })
      .when("/home", {
        templateUrl: "home.html",
        controller: "IndexCtrl"
      });

    $locationProvider.html5Mode(true);
  });

  app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  });

//////////////////////////////////////////////////////////////////////////////////////
  app.controller('IndexCtrl', function($rootScope, $scope, $routeParams, $http) {

  });

  app.controller('AuthCtrl', function($scope, $http) {
    var clientID = '6f03efb8494f4a79b2c5ee39e0642329';
    var clientSecret = '156c3e659ca448a09a832d5822294d91';
    var redirectURI = "http://localhost:3000/auth";
  });

})()