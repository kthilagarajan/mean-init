/*******************************
 * Import Required Modules
 ****************************/
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var layout = require('express-layout');
var path = require("path")
var app = express();
var fileUpload = require('express-fileupload');
/*******************************
 * Require Configuration
 ****************************/
var conf = require('./conf');

/*******************************
 * MongoDB Initializaion
 ****************************/
var mongoDB = require('./modules/mongo-adapter')
var mongoClient = new mongoDB(conf);

app.use(bodyParser());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));
/*
app.use(fileUpload());

//For Static Files
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/webapps'));
app.use(layout());*/


var MemoryStore = session.MemoryStore;
var sessionStore = new MemoryStore();
app.use(session({store:sessionStore, secret: 'secret', key: 'express.sid', cookie: { path: '/', httpOnly: true, maxAge: 8*60*60*1000} }));


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,__setXHR_');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/*
//For Template Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');*/


//app.set("view options", { layout: "layout.html" });
/*
app.homeLayout = __dirname + "/views/layout.html"
app.loginLayout = __dirname + "/views/login-layout.html"*/
var server = require('http').Server(app);
var io = require('socket.io')(server);

//Socket IO Initialization
var SocketIO = require("./modules/socket-io-adapter")
mongoClient.connect(function(dbconn){

    app.dbconn = dbconn;
    app.conf = conf;
    app.socket = new SocketIO(io,app);
    /*app.get('/', function (req, res) {
        res.send('hello world');
    })*/
    console.log("************************************************************");
    console.log(new Date() + ' | Chat app Server Listening on '+ conf['web']['port']);
    console.log("************************************************************");

    server.listen(conf['web']['port'], function () {
        console.log('API running on localhost:'+conf['web']['port'])
    });

    //Initializing the web routes
    var Routes = require('./routes/http-routes');
    new Routes(app);
});
