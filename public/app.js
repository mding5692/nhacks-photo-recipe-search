(function(){
  
  var app = angular.module('nhacks',['ui.router', 'ngRoute']);

  app.config(function ($routeProvider, $locationProvider, $stateProvider, $httpProvider, $urlRouterProvider) {
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
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });

  app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  });

//////////////////////////////////////////////////////////////////////////////////////

 app.controller('IndexCtrl', function($rootScope, $scope, $routeParams, $http){


  });

///////////////////////////// home.html
  app.controller('FoodSearchCtrl', function($scope, $http) {

    var key = '529cd164050b80734aff7a59a2f7a0a3';
    $scope.results = null; 

    function foodSearch(tags) {

      var url = 'http://cors.io?u=http://www.food2fork.com/api/search?key=' + key;
      var urlTags = "";

      if (tags.length > 0) { 
        var i;
        for (i = 0; i < tags.length; i++) {
          if (i == 0) {
            urlTags = tags[i];
          } else {
            urlTags = urlTags + '+' + tags[i];
          }
        }

        url = url + "&q=" + urlTags;
      }
     // $scope.results = url;

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

    }

    // assuming we receives tags as a JSON array
    $scope.food = foodSearch(['salmon', 'lemon']);
  });
//////////////////////// login.html
  app.controller('AuthCtrl', function($scope, $http, $window, $location) {
    var clientID = '6f03efb8494f4a79b2c5ee39e0642329';
    var clientSecret = '156c3e659ca448a09a832d5822294d91';
    var redirectURI = "http://localhost:3000/home";
    var accessToken = "";

    $scope.authenticate = function() {
      var url = 'https://api.instagram.com/oauth/authorize/?client_id=' + clientID + "&redirect_uri=" + redirectURI + "&response_type=token";
      $window.open(url, "_self");
      var path = $location.path;
      console.log(path);
    };
  });


})()