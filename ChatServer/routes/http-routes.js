var Authentication = require('./actions/authentication');
var Products = require('./actions/products');


var fs = require("fs");

var Routes = function(app){
	this.app = app;
	this.authentication = new Authentication(app);
	this.products = new Products(app);
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

	//Beacon Types
	self.app.get('/beacon/types',sessionCheck,function(req,res){
		self.devices.beaconsTypesList(req, function(response){
			res.json(response);
		})
	});
	
};



