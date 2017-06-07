var Users = function(app){
	this.db = app.dbconn;
};

module.exports = Users;

Users.prototype.activeUsers = function(req, cbk){

	var self = this;
	var response = {
		status : false,
		err : null,
		data : null
	};
	var reqObj = req.query;
	var query = {inSession:true}
	if(reqObj.activeStatus === "false"){
        query.inSession = false
	}else if(Object.keys(reqObj).length === 0 || reqObj.activeStatus === ""){
	    query = {}
	}
	self.db.collection('users').find(query).toArray(function(err, result) {
		  if(!err && result.length > 0){
			  response["data"] = result
			  response["status"] = true
			  cbk(response)
		  }
		  else{
			  response['err'] = 'No Active Users';
			  cbk(response)
		  }
	});

};
