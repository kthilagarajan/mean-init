var MongoClient = require('mongodb').MongoClient


var MongoDB = function (conf) {
    this.host = conf['mongodb'].host;
    this.port = conf['mongodb'].port;
    this.dbname = conf['mongodb'].dbname;
    this.username = conf['mongodb'].username;
    this.password = conf['mongodb'].password;
    this.dbconn = null;
};
module.exports = MongoDB;

MongoDB.prototype.connect = function (cbk) {

    var self = this;

    var url = 'mongodb://' + self.host + ':' + self.port + '/' + self.dbname;
    //var url = "mongodb://"+self.username+":"+self.password+"@"+self.host+":"+self.port+"/admin";

    //Use connect method to connect to the Server
    MongoClient.connect(url, {native_parser: true}, function (err, db) {
        if(err){
            console.log(new Date() + " | MongoDB Server Error in authentication.");
            console.log(err);
            self.dbconn = db;
            cbk(db);
        }
        else{
            console.log(new Date() + " | MongoDB Server Connection Establised....");
            console.log("Current database", db.databaseName);
            console.log(new Date() + " | MongoDB Server Authenticated");
            self.dbconn = db;
            /*var query = { username: "thilak" };
            db.collection("users").find(query).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                db.close();
            });*/
            cbk(db);
        }




        /*db.authenticate(self.username, self.password, function(err, res) {
         if(!err) {
         console.log(new Date() + " | MongoDB Server Authenticated");
         self.dbconn = db;
         cbk(db);
         } else {
         console.log(new Date() + " | MongoDB Server Error in authentication.");
         console.log(err);
         self.dbconn = db;
         cbk(db);
         }
         });*/

        // self.dbconn = db;
        //	cbk(db);

    });

};