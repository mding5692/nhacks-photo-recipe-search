(function(){
  
  var app = angular.module('nhacks',['ui.router', 'ngRoute']);

  app.config(function ($routeProvider, $locationProvider, $stateProvider, $httpProvider, $urlRouterProvider) {
    $routeProvider
      .when("/login",{
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

  app.factory('foodTags', function() {
    return [];
  });

  app.factory('scrapedIngredients', function() {
    return {};
  });

//////////////////////////////////////////////////////////////////////////////////////
  
 app.controller('IndexCtrl', function($rootScope, $scope, $routeParams, $http){


  });

///////////////////////////// home.html
  app.controller('FoodSearchCtrl', function($scope, $http, $location, $q, accessTokens, scrapedIngredients, foodTags) {
    var tokenList = $location.url().split("=");
    var accessToken = tokenList[1];

    var foodKey = '529cd164050b80734aff7a59a2f7a0a3';
    var userId = '1662953946';
    $scope.foodPicUrl = "test";
    $scope.tags = []; 
    $scope.recipes = [];

    function getInstagramPics() {
      var deferred = $q.defer();

      var url = 'http://cors.io?u=https://api.instagram.com/v1/users/self/media/recent/?access_token=' + accessToken;
      $http.get(url)
      .then(function(res) {
        $scope.foodPicUrl = res.data.data[0].images.standard_resolution.url;
        localStorage.setItem('foodPic', res.data.data[0].images.standard_resolution.url);

        deferred.resolve(res.data.data[0].images.standard_resolution.url);
      })
      .catch(function(err) {
        console.log(err);
      });

      return deferred.promise;

    };

    function getCredentials() {

      var deferred = $q.defer();
      
      if (localStorage.getItem('tokenTimeStamp') - Math.floor(Date.now() / 1000) > 86400
        || localStorage.getItem('cToken') === null) {
           
        var data = {
          grant_type: 'client_credentials',
          client_id:  'IQ_98zjxbSmn0syP7fok3dma73DfI1wjZ1TYQPjc',
          client_secret: 'rNnsjLs4_2LdSKZ2fBVAVvlVyH5S4PeyHbgy2vHu'
        };

        $.ajax({
          'url': 'https://api.clarifai.com/v1/token',
          'data': data,
          'type': 'POST'
        }).then(function(r) {
          deferred.resolve(r.access_token);
          localStorage.setItem('cToken', r.access_token);
          localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
        });
      } else {
        deferred.resolve(localStorage.getItem('cToken'));
      }

      return deferred.promise;

    };

    function postImage(imgUrl, cToken) {
      var deferred = $q.defer();

      var data = {
        'url': imgUrl
      };

      console.log("ACCESS : " + cToken);
      console.log("imgUrl : " + imgUrl);

      $.ajax({
        'url': 'https://api.clarifai.com/v1/tag',
        'headers': {
          'Authorization': 'Bearer ' + cToken
        },
        'data': data,
        'type': 'POST'
      }).then(function(res){
        deferred.resolve(res.results[0].result.tag.classes);
      });

      return deferred.promise;
      
    }

    function foodSearch(tags) {
      var deferred = $q.defer();

      var url = 'http://www.food2fork.com/api/search?key=' + foodKey;
      var urlTags = "";
      console.log("tags : " + tags);

      urlTags = encodeURI(tags);
      console.log("food2fork: " + urlTags);

      $http({
        url: 'http://localhost:3000/f2frequest?data=' + urlTags,
        method: 'GET'
      }).then(function(response) {
        console.log(response);
        var body = JSON.parse(response.data.body);
        $scope.recipes = body.recipes;
        foodTags = response.data.body.tags;
        deferred.resolve(body);
      });

      return deferred.promise;
    }

    function scrapeUrls(info) {
      var deferred = $q.defer();

      for (var i = 0; i < info.count; i++) {
        var iUrl = info.recipes[i].f2f_url;
        var title = info.recipes[i].title;
        var ingredients = getIngredients(iUrl);
        scrapedIngredients[title] = ingredients;
        console.log(scrapedIngredients);
      }

    }

    function getIngredients(f2fUrl) {
      var deferred = $q.defer();
      var url = "http://localhost:3000/scrapeIngredients?data=" + f2fUrl;

      $http({
        url: url,
        method: 'GET'
      }).then(function(res) {
        deferred.resolve(res);
      }, function(err) {
        console.log(err);
      });

      return deferred.promise;
    }

   
    function run() {
      var deferred = $q.defer();

      getInstagramPics()
      .then( function(instaUrl) {
        console.log("insta url : " + instaUrl);
        getCredentials().then(function(cToken) {
          return postImage(instaUrl, cToken);
        }).then(function(cData) {
          console.log("CDATA : " + cData);
          foodTags = cData;
          return foodSearch(cData);
        }).then(function(response){
          console.log("Foodsearch : " + response)
          deferred.resolve(response);
        });
      });
      
      return deferred.promise;
    }


    run().then(function(res) {
      scrapeUrls(res);
    });

  });
//////////////////////// login.html

  app.controller('AuthCtrl', function($scope, $http, $window, $location, accessTokens) {
    var clientID = '6f03efb8494f4a79b2c5ee39e0642329';
    var clientSecret = '156c3e659ca448a09a832d5822294d91';
    var redirectURI = "http://localhost:3000/home";
    var accessToken = "";

    $scope.authenticate = function() {
      var url = 'https://api.instagram.com/oauth/authorize/?client_id=' + clientID + "&redirect_uri=" + redirectURI + "&response_type=token";
      $window.open(url, "_self");
    };
  });


})()