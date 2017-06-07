var app = angular.module("chatApp",[])
var apiBase = "http://172.16.6.50:8080"
app.controller("homeController", homeController)

function homeController($scope,loginService,chatService){
    var vm = this;
    vm.loginSuccess = false;
    vm.activeUsersList = []

    $scope.checkSession = function(){
       if(getUserSession()){
            vm.loginSuccess = true;
       }else{
            vm.loginSuccess = false;
       }
    }
    function setUserSession(){
        localStorage.setItem("logStatus",true)
    }
    function getUserSession(){
        return localStorage.getItem("logStatus")
    }
    function clearUserSession(){
        localStorage.removeItem("logStatus")
    }
    $scope.checkSession()
    $scope.doLogin = function () {
        loginService.login(vm.login, function (response) {
            if(response.status){
                vm.loginSuccess = true;
                setUserSession()
                chatService.activeUsers("true",function(response){
                    if(response.status){
                        vm.activeUsersList = response.data
                    }else{
                        alert(response.err)
                    }
                })
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
        console.log(data)
        vm.activeUsersList = vm.activeUsersList.concat(data)
        $scope.$apply()
        console.log("vm.activeUsersList")
        console.log(vm.activeUsersList)
    });
    socket.on('disconnect', function(){
        console.log("Socket Disconnected")
    });

    $scope.logout = function(){
        clearUserSession()
    }
}