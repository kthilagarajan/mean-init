var sio = require('socket.io');
var connect = require("connect");
var S = require('string');
var SingleChat = require("../routes/actions/SingleChat")

var SocketIO = function (io, app) {
    this.io = io;
    this.sessionStore = app.session;
    this.dbconn = app.dbconn;
//	this.setAuthorize();
    this.eventHandlers();
    this.singleChat = new SingleChat(app)
};
module.exports = SocketIO;

SocketIO.prototype.eventHandlers = function () {

    var self = this;
    self.io.on('connection', function (socket) {
        console.log("SOCKET CONNECTION CREATED")
        /*socket.on('room', function (room) {
            socket.set('room', room, function () {
                console.log('New Room ' + room + ' Created...!');
            });
            socket.join(room);
        })*/
        socket.on("privateChat",function (msg) {
            console.log("Entered Private Chat")
            console.log(self.singleChat.storeMessage())
        });

        socket.on("singleChat",function(data){
            console.log("socket",data)
            self.io.emit("singleChat",data)
        })

        var parsedCookie = self.parseCookie(socket.handshake.headers.cookie);
        //	console.log("*************",parsedCookie)
//        var sessionID = parsedCookie['express.sid'] ? S(parsedCookie['express.sid']).replaceAll("s:", "").s : "ID NOT FOUND";
        /*socket.join(sessionID); //socket.handshake.sessionID);
        console.log('A socket with sessionID ' + sessionID + ' connected!');
        socket.on('global_chat', function (data) {
            self.send('global_msg', null, data);
            // console.log(data);
        });*/
        socket.on('disconnect', function () {
//            console.log('A socket with sessionID ' + sessionID
//                + ' disconnected!');
//            self.removeSession(sessionID);
            console.log("Socket Disconnected")
        });
    });


}


SocketIO.prototype.setAuthorize = function () {

    var self = this;
    self.io.use(function (socket, next) {

        var handshakeData = socket.request;

        if (handshakeData.headers.cookie) {


            handshakeData.cookie = self.parseCookie(handshakeData.headers.cookie);
            console.log("*****" + handshakeData.cookie)
            handshakeData.sessionID = S(handshakeData.cookie['express.sid']).replaceAll("s:", "").s;

            self.sessionStore.get(handshakeData.sessionID, function (err, session) {
                if (err || !session) {
                    console.log("no session found in session store");
                    next(new Error('not authorized'));
                } else {
                    handshakeData.session = session;
                    next();
                }
            });
        } else {
            console.log("no session found in session store");
            next(new Error('not authorized'));
        }
    });

}


SocketIO.prototype.parseCookie = function (str) {

    var obj = {}
    var pairs = str.split(/[;,] */);
    var encode = encodeURIComponent;
    var decode = decodeURIComponent;

    pairs.forEach(function (pair) {
        var eq_idx = pair.indexOf('=')
        var key = pair.substr(0, eq_idx).trim()
        var val = pair.substr(++eq_idx, pair.length).trim();

        // quoted values
        if ('"' == val[0]) {
            val = val.slice(1, -1);
        }

        // only assign once
        if (undefined == obj[key]) {
            obj[key] = decode(val);
        }
    });

    return obj;
}


SocketIO.prototype.removeSession = function (sessionId) {

    var self = this;

    var criteria = {
        session: sessionId
    };
    self.dbconn.collection('socket_session_store').remove(criteria, function (err, removed) {
        console.log("Socket Session Removed " + sessionId);
    });
}


SocketIO.prototype.send = function (eventId, sessionId, message) {


    var self = this;

    if (sessionId) {

        self.io.to(sessionId).emit(eventId, message);

    }
    else {
        self.io.emit(eventId, message);
    }
};
