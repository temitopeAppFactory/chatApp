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
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'home/home.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireSignIn().then(function(auth){
              $state.go('channels');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('login',{
        url: '/login',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/login.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireSignIn().then(function(auth){
              $state.go('home');
            }, function(error){
              return;
            });
          } 
        }
      })
      .state('userHome',{
        url: '/userHome',
        controller: 'userHomeCtrl as uCtrl',
        templateUrl: 'userHome/home.html'
      })
      .state('channels', {
        url: '/channels',
        controller: 'ChannelsCtrl as channelsCtrl',
        templateUrl: 'channels/index.html',
        resolve: {
          channels: function(Channels){
            return Channels.$loaded();
          },
          profile: function($state, Auth, Users){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded().then(function(profile){
                if (profile.displayName) {
                  return profile;
                } else {
                  $state.go('profile');
                }
              });
            }, function(error){
              $state.go('home');
            });
          }
        }
      })
      .state('channels.create',{
        url: '/create',
        templateUrl: 'channels/create.html',
        controller: 'ChannelsCtrl as channelsCtrl'
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
      .state('channels.messages',{
        url:'/{channelId}/messages',
        templateUrl: 'channels/messages.html',
        controller: 'MessagesCtrl as messagesCtrl',
        resolve:{
          messages: function($stateParams, Messages){
            return Messages.forChannel($stateParams.channelId).$loaded();
          },
          channelName: function($stateParams, channels){
            return '#'+channels.$getRecord($stateParams.channelId).name;
          }
        }
      })
      .state('channels.direct', {
        url: '/{uid}/messages/direct',
        templateUrl: 'channels/messages.html',
        controller: 'MessagesCtrl as messagesCtrl',
        resolve: {
          messages: function($stateParams, Messages, profile){
            return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
          },
          channelName: function($stateParams, Users){
            return Users.all.$loaded().then(function(){
              return '@'+Users.getDisplayName($stateParams.uid);
            });
          }
        }
      })
      .state('register', {
        url: '/register',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/register.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireSignIn().then(function(auth){
              $state.go('home');
            }, function(error){
              return;
            })
          } 
        }
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