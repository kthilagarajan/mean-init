app.service("chatService", chatService)

function chatService($http) {
    return {
        activeUsers : function (activeStatus, cbk) {
            $http.get(apiBase+"/activeUsers?activeStatus="+activeStatus).then(function (response) {
                cbk(response.data)
            })
        }
    };
}