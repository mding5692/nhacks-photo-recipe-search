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

  app.factory('accessTokens', function() {
    return {};
  });
//////////////////////////////////////////////////////////////////////////////////////
  
 app.controller('IndexCtrl', function($rootScope, $scope, $routeParams, $http){


  });

///////////////////////////// home.html
  app.controller('FoodSearchCtrl', function($scope, $http, $location, accessTokens) {
    var tokenList = $location.url().split("=");
    var accessToken = tokenList[1];

    var foodKey = '529cd164050b80734aff7a59a2f7a0a3';
    var userId = '1662953946';
    $scope.foodPicUrl = "asdf";
    $scope.tags = [];
    $scope.results = null; 
    $scope.recipeImages = [];

    function getInstagramPics(callback) {
      var url = 'http://cors.io?u=https://api.instagram.com/v1/users/self/media/recent/?access_token=' + accessToken;
      $http.get(url)
      .then(function(res) {
        $scope.foodPicUrl = res.data.data[0].images.standard_resolution.url;
        console.log("asdf: " + $scope.foodPicUrl);
        localStorage.setItem('foodPic', res.data.data[0].images.standard_resolution.url);
        console.log(res.data.data[0].images.standard_resolution.url);
        callback();
      })
      .catch(function(err) {
        console.log(err);
      });

    };

    function getCredentials(cb) {
      var data = {
        grant_type: 'client_credentials',
        client_id:  'IQ_98zjxbSmn0syP7fok3dma73DfI1wjZ1TYQPjc',
        client_secret: 'rNnsjLs4_2LdSKZ2fBVAVvlVyH5S4PeyHbgy2vHu'
      };

      return $.ajax({
        'url': 'https://api.clarifai.com/v1/token',
        'data': data,
        'type': 'POST'
      })
      .then(function(r) {
        localStorage.setItem('cToken', r.access_token);
        localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
        cb();
      });
    };

    function postImage(imgUrl) {
      var data = {
        'url': imgUrl
      };

      var cToken = localStorage.getItem('cToken');
      console.log("ACCESS : " + cToken);
      console.log("imgUrl : " + imgUrl);

      return $.ajax({
        'url': 'https://api.clarifai.com/v1/tag',
        'headers': {
          'Authorization': 'Bearer ' + cToken
        },
        'data': data,
        'type': 'POST'
      }).then(function(res){
        $scope.tags = res.results[0].result.tag.classes;
        console.log($scope.tags);
      });
      
    }


    function foodSearch() {
      var url = 'http://cors.io?u=http://www.food2fork.com/api/search?key=' + foodKey;
      var urlTags = "";
      var tags = $scope.tags;

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

      $http({
        url: url,
        method: 'GET'
      }).then(function(response) {
        $scope.results = response;
        for(var i = 0; i < response.data.count; i++) {
          $scope.recipeImages.push(response.data.recipes[i].image_url);
        }
      })
      .catch(function(err) {
        console.log(err);
      }); 
    };

    function run() {
      getInstagramPics(function() {
        if (localStorage.getItem('tokenTimeStamp') - Math.floor(Date.now() / 1000) > 86400
        || localStorage.getItem('cToken') === null) {
        getCredentials(function() {
          console.log(localStorage.getItem('foodPic'));
          postImage($scope.foodPicUrl);
        });
      } else {
        console.log("scope foodpic: " + $scope.foodPicUrl);
        postImage($scope.foodPicUrl);
      }

      foodSearch();
      });
      /*
      //var url = $scope.foodPicUrl;
      //localStorage.setItem('foodPic', $scope.foodPicUrl);
      if (localStorage.getItem('tokenTimeStamp') - Math.floor(Date.now() / 1000) > 86400
        || localStorage.getItem('cToken') === null) {
        getCredentials(function() {
          console.log(localStorage.getItem('foodPic'));
          //postImage();
        });
      } else {
        console.log("scope foodpic: " + $scope.foodPicUrl);
        //postImage();
      }

      foodSearch();
      */
    }

    run();

  });
//////////////////////// login.html

  app.controller('AuthCtrl', function($scope, $http, $window, $location, accessTokens) {
    var clientID = '6f03efb8494f4a79b2c5ee39e0642329';
    var clientSecret = '156c3e659ca448a09a832d5822294d91';
    var redirectURI = "http://localhost:3000/home";
    var accessToken = "";//1662953946.6f03efb.7b2b3221dc9747dda8a7cc2cfc8fd60e";

    $scope.authenticate = function() {
      var url = 'https://api.instagram.com/oauth/authorize/?client_id=' + clientID + "&redirect_uri=" + redirectURI + "&response_type=token";
      $window.open(url, "_self");

    };
  });


})()