angular.module('todoController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','Todos', function($scope, $http, Todos) {
		$scope.formData = {};
		$scope.loading = true;
		getALL();
		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		function getALL() {Todos.get()
			.success(function(data) {
				$scope.todos = data;
				$scope.loading = false;
			});
		}

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.email != undefined) {
				$scope.loading = true;

					Todos.create($scope.formData)

					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						getALL();
					}).error(function(response){
                        $scope.loading= false;
                        alert(response);
                        $scope.formData.email = '';
                    }
            
                    );
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			$scope.loading = true;

			Todos.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					getALL();
				});
		};
	}]);