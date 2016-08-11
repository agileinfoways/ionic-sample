var app_ctrl = angular.module('starter.controllers', [])

app_ctrl.controller('MainCtrl',
					['$scope','$stateParams','GS','$state'
					 ,function($scope, $stateParams,GS,$state){
					 $scope.loginData = {};
					 $scope.signupData = {};
					 
					 $scope.doLogin = function(){
					 GS.showLog("doLogin ==>"+JSON.stringify($scope.loginData));
					 
					 var u_name = GS.Pref_Get('pref_u_name');
					 var u_pass = GS.Pref_Get('pref_u_pass');
					 
					 if($scope.loginData.username != u_name){
					 GS.callAlert("Please enter registered username");
					 
//					 navigator.notification.confirm('Please enter registered username', // message
//													function(){}, // callback
//													'APP NAME', // title
//													['OK'] // buttonName
//													);
					 
					 }else if($scope.loginData.password != u_pass){
					 GS.callAlert("Please enter registered password");
					 }else{
					 localStorage.setItem("pref_login_status",1);
					 $state.go('app.playlists');
					 }
					 
					 };
					 
					 
					 $scope.doSignUp = function(){
					 GS.showLog("doLogin ==>"+JSON.stringify($scope.signupData));
					 GS.Pref_Save('pref_u_name',$scope.signupData.username);
					 GS.Pref_Save('pref_u_pass',$scope.signupData.password);
					 $state.go('main');
					 };
					 
					 }]);

app_ctrl.controller('AppCtrl'
					,['$scope','$ionicModal','$timeout'
					  ,function($scope, $ionicModal, $timeout) {
					  
					  // With the new view caching in Ionic, Controllers are only called
					  // when they are recreated or on app start, instead of every page change.
					  // To listen for when this page is active (for example, to refresh data),
					  // listen for the $ionicView.enter event:
					  //$scope.$on('$ionicView.enter', function(e) {
					  //});
					  
					  // Form data for the login modal
					  $scope.loginData = {};
					  
					  // Create the login modal that we will use later
					  $ionicModal.fromTemplateUrl('templates/login.html', {
												  scope: $scope
												  }).then(function(modal) {
														  $scope.modal = modal;
														  });
					  
					  // Triggered in the login modal to close it
					  $scope.closeLogin = function() {
					  $scope.modal.hide();
					  };
					  
					  // Open the login modal
					  $scope.login = function() {
					  $scope.modal.show();
					  };
					  
					  // Perform the login action when the user submits the login form
					  $scope.doLogin2 = function() {
					  console.log('Doing login', $scope.loginData);
					  
					  // Simulate a login delay. Remove this and replace with your login
					  // code if using a login system
					  $timeout(function() {
										$scope.closeLogin();
										}, 1000);
					  };
					  }]);

app_ctrl.controller('PlaylistsCtrl',
					['$scope'
					 ,function($scope) {
					 $scope.playlists = [
										 { title: 'Reggae', id: 1 , year: 2001},
										 { title: 'Chill', id: 2 , year: 2009},
										 { title: 'Dubstep', id: 3, year: 2015 },
										 { title: 'Indie', id: 4, year: 2010 },
										 { title: 'Rap', id: 5 , year: 2000},
										 { title: 'Cowbell', id: 6, year: 2004 }
										 ];
					 }]);

app_ctrl.controller('PlaylistCtrl',
					['$scope','$stateParams'
					 ,function($scope, $stateParams) {
					 $scope.p_id = $stateParams.playlistId;
					 $scope.p_albumYear = $stateParams.albumYear;
					 }]);

app_ctrl.controller('SearchCtrl',
					['$scope','$stateParams','$timeout','GS'
					 ,function($scope, $stateParams, $timeout,GS) {
					 
					 $scope.getUserLocation = function(){
					 var posOptions = {timeout: 10000, enableHighAccuracy: false};
					 
					 navigator.geolocation.getCurrentPosition(
															  function (position) {
															  var lat  = position.coords.latitude;
															  var longg = position.coords.longitude;
															  GS.showLog("lat:: "+lat+" long::"+longg);
															  
															  
															  var mymap = new google.maps.Map(document.getElementById('googleMap'), {
																							  zoom: 15,
																							  disableDefaultUI : false,
																							  zoomControl: true,
																							  center: new google.maps.LatLng(lat,longg),
																							  mapTypeId: google.maps.MapTypeId.ROADMAP
																							  });
															  
															  var userLatLong = new google.maps.LatLng(lat,longg);
															  var user_loc_marker = new google.maps.Marker({
																										   position:userLatLong,
																										   map: mymap
																										   });

															  
															  },
															  function(err) {
															  GS.callAlert('Allow Application to access your location from settings OR Please turn on GPS');
															  },posOptions);
					
					 };
					 
					 $scope.$on("$ionicView.afterEnter", function(event, data){
					   $timeout(function(){
								$scope.getUserLocation();
								},500);
								
								});
					 
					 }]);
