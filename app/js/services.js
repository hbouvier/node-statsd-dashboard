angular.module('Services', ['ngResource']).
    /**
     * Notice that at we wrap each socket callback in $scope.$apply. This tells 
     * AngularJS that it needs to check the state of the application and update 
     * the templates if there was a change after running the callback passed to 
     * it. Internally, $http works in the same way; after some XHR returns, it 
     * calls $scope.$apply, so that AngularJS can update its views accordingly.
     */
    factory('Socket', function ($rootScope) {
        var socket = io.connect();
        console.log('socket.connect=', socket);
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {  
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    })

;
