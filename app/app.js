'use strict';

/**
 * @ngdoc overview
 * @name angularfireSlackApp
 * @description
 * # angularfireSlackApp
 *
 * Main module of the application.
 */
angular
  .module('angularfireSlackApp', [
    'firebase',
    'angular-md5',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html'
      })
      .state('login',{
        url: '/login',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/login.html'
      })
      .state('userHome',{
        url: '/userHome',
        controller: 'userHomeCtrl as uCtrl',
        templateUrl: 'userHome/home.html'
      })
      .state('profile',{
        url: '/profile',
        controller: 'ProfileCtrl as profileCtrl',
        templateUrl: 'users/profile.html',
        resolve: {
          auth:function($state, Users, Auth){
            return Auth.$requireSignIn().catch(function(){
              $state.go('home');
            });
          },
          profile: function(Users, Auth){
          return Auth.$requireSignIn().then(function(auth){
            return Users.getProfile(auth.uid).$loaded();
          });
        }
        }
      })
      .state('register', {
        url: '/register',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/register.html'
      });

    $urlRouterProvider.otherwise('/');
  })
  
.config(function(){
  var config = {
    apiKey: "AIzaSyD8TaMuOCMhXwjvDEAEep9bYf43c7JW81A",
    authDomain: "chatapptest-8c7a6.firebaseapp.com",
    databaseURL: "https://chatapptest-8c7a6.firebaseio.com",
    projectId: "chatapptest-8c7a6",
    storageBucket: "chatapptest-8c7a6.appspot.com",
    messagingSenderId: "799708699088"
  };
  firebase.initializeApp(config);
});