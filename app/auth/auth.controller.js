angular.module('angularfireSlackApp')
	.controller('AuthCtrl', function(Auth, $state){
		var authCtrl = this;

		authCtrl.user = {
			email:'',
			password:'',
			displayName: ''
		};

		authCtrl.login = function(){

			Auth.$signInWithEmailAndPassword(authCtrl.user.email, authCtrl.user.password).then(function (auth){
				$state.go('userHome');
			}, function(error){
				authCtrl.error = error;
			});
		};

		authCtrl.register = function(){

			Auth.$createUserWithEmailAndPassword(authCtrl.user.email, authCtrl.user.password).then(function(user){
				//authCtrl.login();
				$state.go('home');
				/* to not login automatically after registration, use $state.go('home') instead of authCtrl.login() */
			}, function(error){
				authCtrl.error = error;
			});
		};
	})
	.controller('userHomeCtrl', ['$scope', function($scope){
		var uCtrl = this;
		$scope.name = 'timmy';
	}])

