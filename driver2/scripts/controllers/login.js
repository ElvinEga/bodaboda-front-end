'use strict';

angular.module('taxigoDriverApp')
    .controller('LoginCtrl', ['$scope', '$rootScope', 'gmaps', 'auth', '$state', 'logger' , 'routes' , function ($scope, $rootScope, gmaps, auth, $state, logger, routes) {

        var username, password;
        /*checkLogin: false - > login false: user or pass*/
        $scope.loginProcess = false;

        $scope.checkLogin = false;
        $scope.customer = {};
        $scope.customer.username = auth.getLastLoginName() || '';

        /*function Login : req to server  */
        if (window.socketIo) {
            window.socketIo.disconnect();
        }

        $scope.login = function (loginData) {

            $scope.loginProcess = true;
            username = loginData.username;
            password = loginData.password;

            auth.login(username, password, function (err, result) {

                if (err) {
                    $scope.checkLogin = true;
                    $scope.loginProcess = false;
                    window.toastr.success('Username or Password is incorrect');
                }
                else {
                    $scope.loginProcess = false;
                    $rootScope.isLogin = true;
                    logger.info('userLogin', 'result', result);
                    if (window.socketIo) {
                        auth.connectSocketIo();
                    }

                    window.toastr.success('Login is successful');

                    $state.go('taxiGoDriver.home');
                }
            });
        };
    }]);
