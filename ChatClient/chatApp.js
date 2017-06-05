var app = angular.module("chatApp",[])
var apiBase = "http://localhost:8080"
app.controller("homeController", homeController)

function homeController($scope,loginService){
    var vm = this;
    vm.loginSuccess = false;
    $scope.doLogin = function () {
        loginService.login(vm.login, function (response) {
            if(response.status){
                vm.loginSuccess = true;
                alert("Login Success")
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

    var socket = io('http://localhost:8080');
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
    socket.on('event', function(data){

    });
    socket.on('disconnect', function(){
        console.log("Socket Disconnected")
    });
}