var app = angular.module("chatApp",[])
var apiBase = "http://172.16.6.50:8080"
app.controller("homeController", homeController)

function homeController($scope,loginService,chatService){
    var vm = this;
    vm.loginSuccess = false;
    vm.activeUsersList = []

    $scope.getActiveUsers = function(){
            chatService.activeUsers("true",function(response){
                if(response.status){
                    vm.activeUsersList = response.data
                }else{
                    alert(response.err)
                }
            })
        }

    $scope.checkSession = function(){
       if(getUserSession()){
            $scope.getActiveUsers()
            vm.loginSuccess = true;
       }else{
            vm.loginSuccess = false;
       }
    }
    $scope.checkSession()
    $scope.doLogin = function () {
        loginService.login(vm.login, function (response) {
            if(response.status){
                vm.loginSuccess = true;
                setUserSession(vm.login)
                vm.currentUser = getUserSession().un
                $scope.getActiveUsers()
            }else{
                alert(response.err)
            }
        })
    }


    $scope.doRegister = function () {
        loginService.register(vm.register, function (response) {
            if(response.status){
                alert("Registered Successfully! Do Login!")
            }else{
                alert(response.err)
            }
        })
    }

    var socket = io('http://172.16.6.50:8080');
    vm.chatHistory = []


    socket.on('connect', function(){
        console.log("Socket Connected")
    });
    socket.on('activeUsers', function(data){
        var alreadyExists = false;
        for(key in vm.activeUsersList){
            if(vm.activeUsersList[key].username === data.username){
                vm.activeUsersList = _.reject(vm.activeUsersList, {"username" : data.username})
                alreadyExists =true;
            }
        }
        if(!alreadyExists){
            vm.activeUsersList = vm.activeUsersList.concat(data)
        }
        $scope.$apply()
    });
    socket.on("singleChat",function(data){
        vm.chatHistory = vm.chatHistory.concat(data)
        $scope.$apply()
    })

    vm.sendMessage = function (msgText) {
            var chatInfo = {
                "fromId" : getUserSession().un,
                "message" : msgText,
                "date" : new Date("DD-MM-YYYY hh:mm:ss")
            }
            socket.emit("singleChat",chatInfo)
            vm.messageText = ""
        }
    socket.on('disconnect', function(){
        console.log("Socket Disconnected")
    });

    $scope.logout = function(){
        loginService.logout(vm.login, function (response) {
            if(response.status){
                clearUserSession()
                vm.loginSuccess = false;
                window.location.reload()
            }else{
                alert(response.err)
            }
        })
    }
    function setUserSession(userObj){
        localStorage.setItem("user",JSON.stringify(userObj))
    }
    function getUserSession(){
        return JSON.parse(localStorage.getItem("user"))
    }
    function clearUserSession(){
        localStorage.removeItem("user")
    }
}