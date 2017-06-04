var app = angular.module("chatApp",[])

app.controller("homeController", homeController)

function homeController($scope){
    var vm = this;
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