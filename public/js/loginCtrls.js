
loginDbControllers.controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',  
    function AdminUserCtrl($scope, $location, $window, UserService, AuthenticationService) {
 
        //User Controller (register, login, logout)
        $scope.signIn = function signIn(username, password) {
            if (username != null && password != null) {

                UserService.signIn(username, password).success(function(data) {
                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage.token = data.token;
                    if (!$window.sessionStorage.equipid){
                        $window.sessionStorage.equipid="teste1";
                    }                    
                    $location.path("/").replace();
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }
 
        $scope.logOut = function logOut() {
            if (AuthenticationService.isAuthenticated) {
                
                UserService.logOut().success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    delete $window.sessionStorage.token;
                    $location.path("/").replace();
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("/login");
            }
        }
        
        $scope.register = function register(username, password, passwordConfirm) {
            if (AuthenticationService.isAuthenticated) {
                $location.path("/").replace();
            }
            else {
                UserService.register(username, password, passwordConfirm).success(function(data) {
                    $location.path("/login");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }
    }
]);
