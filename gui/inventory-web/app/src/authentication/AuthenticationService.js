function AuthenticationService($log, $http, $rootScope) {
    $http.defaults.headers.common.Accept = 'application/json';
    var service = {};

    function login(userName) {
        $log.info("Logging in " + userName);
        $rootScope.authenticated = true;
        $rootScope.userName = userName;
    }

    function clearCredentials() {
        $rootScope.userName = null;
        $rootScope.authenticated = false;
    }

    $http.get('/api/user').success(function (data) {
        $log.debug("user: " + JSON.stringify(data));
        if (data.name) {
            login(data.name);
            $rootScope.$broadcast('oauth:profile', data);
        } else {
            clearCredentials();
            $log.info("Not logged in!");
        }
    }).error(function () {
        $rootScope.authenticated = false;
    });

    service.isLoggedIn = function () {
        return typeof $rootScope.authenticated;
    };

    service.logout = function () {
        clearCredentials();
    };

    return service;
}


export default ['$log', '$http', '$rootScope', AuthenticationService];
