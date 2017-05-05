angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/users');
			},
			create : function(todoData) {
				return $http.post('/singup', todoData);
			},
			delete : function(email) {
				return $http.delete('/api/users/' + email);
			}
		}
	}]);