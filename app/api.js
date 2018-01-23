//Login
login: function (username, password, cb) {
    var me = this;


    $rootScope.crudProcessing = true;
    $http(
        {
            'method': 'POST',
            'data': {'username': username, 'password': password},
            'url': appConfig.apiHost + '/login'
        })
        .success(function (data) { //.success(function(data, status, headers, config)
            $logger.info('login', 'success', true);

            var user = data.user;
            var token = data.token;

            me.setAppRegister(user);
            me.setCurrentUser(user);
            me.setToken(token);

            me.setLastLoginName();
            me.pendingStateChange = null;

            cb(null, data);
        })
        .error(function (err) {

            $rootScope.crudProcessing = false;
            $rootScope.loginError = err;

            cb(err, null);
        });
}
//Register
register: function (data, cb) {
    var me = this;
    var registerData = {
        username: data.username.toLowerCase(),
        password: data.password,
        deviceId: data.deviceId
    };
    $http(
        {
            'method': 'POST',
            'data': registerData,
            'url': appConfig.apiHost + '/register'
        })
        .success(function (data) {
            /*console.log('data', data);*/
            me.setAppRegister(data.data);
            cb(null, data);
        })
        .error(function (err) {
            cb(err, null);
        });
}
//updateUserInfo
updateUserInfo: function (data, cb) {
    var me = this;
    var registerData = {
        username: data.username,
        password: data.password,
        userId: me.getAppRegisterInfo().id,
        deviceId: appConfig.deviceId,
        fullname: data.fullname,
        phone: data.username
        /*birthday: data.birthday,*/
        /*location: data.location*/
    };
    $http(
        {
            'method': 'POST',
            'data': registerData,
            'url': appConfig.apiHost + '/registerCustomer'
        })
        .success(function (data) {
            /*console.log('data', data);*/
            //me.setAppRegister(data.data);
            cb(null, data);
        })
        .error(function (err) {
            cb(err, null);
        });
}
