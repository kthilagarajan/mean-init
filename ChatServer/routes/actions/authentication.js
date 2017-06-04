var Authentication = function(app){
	this.db = app.dbconn;
	
	
};

module.exports = Authentication;


Authentication.prototype.login = function(req, cbk){
	
	var self = this;
	
	var response = {
		status : false,
		err : null,
		data : null
	};
	
	var reqObj = req.body;
	
	var username = reqObj.userName;
	var password = reqObj.password;
	//{'$and':[{username:username},{role:Number(reqObj.role)}]}
	self.db.collection('users').findOne({username:username}, function(err, result) {
		  if(!err && result){
			  if(result.password == password && result.role == Number(reqObj.role)){
				  delete result.password;
				  
				  response['status'] = true;
				  response['data'] = result;
				  cbk(response)
				  
			  }
			  else{
				  response['err'] = 'password mismatch';
				  cbk(response)
			  }
			 
		  }
		  else{
			  response['err'] = 'No User Found';
			  cbk(response)
		  }
	});
	
};

Authentication.prototype.createUser = function(req, cbk){
	
	var self = this;
	
	var response = {
		status : false,
		err : null,
		data : null
	};
	
	var reqObj = req.query;

	reqObj['createdTime'] = new Date().getTime;
	reqObj['role'] = 3;

	self.db.collection('users').findOne({'$or':[{email:reqObj.email},{username:reqObj.username}]}, function(err, user) {

		 if(!user){			
	
			self.db.collection('users').insert(reqObj, function(err, result) {
				  if(!err){
			  			
			  			self.db.collection('users').findOne({email:reqObj.email}, function(err, user) {

							  delete user.password;
							  
							  response['status'] = true;
							  response['data'] = user;
							  cbk(response)

						  });
							  
						

				  }
				  else{

					  response['err'] = 'Error in insertion';
					  cbk(response)
				  }
			});
		}
		else{
			 response['err'] = 'user already exists';
			  cbk(response)
		}
	});
	
};
