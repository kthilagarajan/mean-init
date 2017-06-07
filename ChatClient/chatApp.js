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
    vm.chatHistory = [
        {
            "client" : true,
            "server" : false,
            "message" : "Hi, How are you"
        },
        {
            "client" : false,
            "server" : true,
            "message" : "I am fine"
        }
    ]
    vm.sendMessage = function (msgText) {
        vm.chatHistory.push({
            "client" : true,
            "server" : false,
            "message" : msgText
        })
        vm.messageText = ""
    }

    socket.on('connect', function(){
        console.log("Socket Connected")
    });
    socket.on('activeUsers', function(data){
        vm.activeUsersList = _.uniq(vm.activeUsersList.concat(data))
        $scope.$apply()
    });
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