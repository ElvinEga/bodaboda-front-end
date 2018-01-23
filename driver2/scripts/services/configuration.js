'use strict';

angular.module('taxigoDriverApp')
    .factory('config', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

        var config = {
            deviceId: (window.device) ? device.uuid : '9f9f9f99999',
            name: 'Taxi Go',
            apiHost: 'https://bodaboda1.herokuapp.com', //http://192.168.5.105:9696
            mediaHost: 'https://bodaboda1.herokuapp.com',
            isLogin: false
        };
        return config;
    }]);
