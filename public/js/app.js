// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])
app.config(function($stateProvider) {
  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'home.html'
  })
  .state('page1', {
    url: '/page1',
    templateUrl: '../views/page1.html'
  });
});

app.controller('MyCtrl', function($scope, $ionicPopup) {

   // When button is clicked, the popup will be shown...
   $scope.showConfirm = function() {
	
      var confirmPopup = $ionicPopup.confirm({
         title: 'Title',
         template: 'Are you sure?'
      });

      confirmPopup.then(function(res) {
         if(res) {
            console.log('Sure!');
         } else {
            console.log('Not sure!');
         }
      });
		
   };
   
    $scope.likes = function() {
		document.getElementById("like").innerHTML = parseInt(document.getElementById("like").innerHTML)+1;
	}

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
