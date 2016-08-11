var app = angular.module('starter', ['ionic', 'starter.controllers']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
					   // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
					   // for form inputs)
					   if (window.cordova && window.cordova.plugins.Keyboard) {
					   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
					   cordova.plugins.Keyboard.disableScroll(true);
					   
					   }
					   if (window.StatusBar) {
					   // org.apache.cordova.statusbar required
					   StatusBar.styleDefault();
					   }
					   });
		});

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
		   $stateProvider
		   
		   .state('main', {
			   url: '/main',
			   templateUrl: 'templates/main.html',
			   controller: 'MainCtrl'
			   })
		   
		   
		   .state('register', {
			   url: '/register',
			   templateUrl: 'templates/register.html',
			   controller: 'MainCtrl'
			   })
		   
		   .state('app', {
				  url: '/app',
				  abstract: true,
				  templateUrl: 'templates/menu.html',
				  controller: 'AppCtrl'
				  })
		   
		   .state('app.search', {
				  url: '/search',
				  views: {
				  'menuContent': {
				  templateUrl: 'templates/search.html',
				  controller: 'SearchCtrl'
				  }
				  }
				  })
		   
		   .state('app.browse', {
				  url: '/browse',
				  views: {
				  'menuContent': {
				  templateUrl: 'templates/browse.html'
				  }
				  }
				  })
		   .state('app.playlists', {
				  url: '/playlists',
				  views: {
				  'menuContent': {
				  templateUrl: 'templates/playlists.html',
				  controller: 'PlaylistsCtrl'
				  }
				  }
				  })
		   
		   .state('app.single', {
				  url: '/playlists/:playlistId/:albumYear',
				  views: {
				  'menuContent': {
				  templateUrl: 'templates/playlist.html',
				  controller: 'PlaylistCtrl'
				  }
				  }
				  });
		   // if none of the above states are matched, use this as the fallback
		   if(localStorage.getItem("pref_login_status") == "1" || localStorage.getItem("pref_login_status") == 1 ){
		   $urlRouterProvider.otherwise('/app/playlists');
		   }else{
		   $urlRouterProvider.otherwise('/register');
		   }
		   
		   $ionicConfigProvider.views.swipeBackEnabled(false);
		   });

// GS = Global Service
app.service('GS',
			['$rootScope', '$http', '$q', 'API_URL','$timeout','$ionicLoading','$state','$ionicPopup'
			 ,function ($rootScope, $http, $q, API_URL,$timeout,$ionicLoading,$state,$ionicPopup){
			 
			 this.showLog = function(msg){
			 console.log(msg);
			 };
			 
			 this.Pref_Save = function(key,value){
				this.showLog('save :: '+key+' :: '+value);
				return localStorage.setItem(key,JSON.stringify(value));
			 };
			 
			 this.Pref_Get = function(key){
				this.showLog('get :: '+key+' :: '+localStorage.getItem(key));
				return JSON.parse(localStorage.getItem(key));
			 };
			 
			 this.callAlert = function(msg){
				
			 navigator.notification.confirm(msg, // message
											function(){}, // callback
											'APP NAME', // title
											['OK'] // buttonName
											);
			 
			 };
			 
			 this.Ajax= function(req_type,post_data) {
				var network = this.checkNetwork();
				this.showLog("==>"+network);
				
				var deferred = $q.defer();
				
			 if(network == "No network connection" || network == "Unknown connection" ){
			 deferred.reject('Please check your internet connection');
			 return deferred.promise;
			 }else{
				$ionicLoading.show({
								   template: 'Loading ...'
								   });
				var req = {
			 method: req_type,
			 url: API_URL,
			 headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			 transformRequest: function(obj) {
			 var str = [];
			 for(var p in obj)
			 str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			 return str.join("&");
			 },
			 data:post_data
				};
				$http(req)
				.success(function(data, status, headers, config){
						 $ionicLoading.hide();
						 deferred.resolve(data);
						 })
				.error(function(data, status, headers, config) {
					   $ionicLoading.hide();
					   deferred.reject(err_server);
					   });
				
				return deferred.promise;
			 }
			 };
			 
			 
			 }]);

app.constant('API_URL','');