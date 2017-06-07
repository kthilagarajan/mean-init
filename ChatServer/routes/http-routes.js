var Authentication = require('./actions/authentication');
var Users = require("../routes/actions/users")


var fs = require("fs");

var Routes = function(app){
	this.app = app;
	this.authentication = new Authentication(app);
    this.users = new Users(app)
	this.init();
};
module.exports = Routes;

var sessionCheck = function(req, res, next){
	
	/*if(req.session && req.session.user){
		 next();
	}
	else{
		res.redirect("/");
	}*/
	 next();
	
};


Routes.prototype.init = function(){
	var self = this;
	
	self.app.get('/', function (req, res) {
		res.json({status:true});
	});

	self.app.post('/login',function(req,res){
        self.authentication.login(req, function(response){
            res.json(response);
        })
    });

    self.app.post('/register',function(req,res){
        self.authentication.createUser(req, function(response){
            res.json(response);
        })
    });
    self.app.get('/activeUsers',function(req,res){
        self.users.activeUsers(req, function(response){
            res.json(response);
        })
    });

    self.app.post('/logout',function(req,res){
        self.authentication.logout(req, function(response){
            res.json(response);
        })
    });
};



