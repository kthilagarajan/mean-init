app.service("loginService", loginService)

function loginService($http) {
    return {
        login : function (loginInfo, cbk) {
            $http.post(apiBase+"/login",loginInfo).then(function (response) {
                cbk(response.data)
            })
        },
        register : function (registerInfo, cbk) {
            $http.post(apiBase+"/register",loginInfo).then(function (response) {
                cbk(response.data)
            })
        }
    };
}