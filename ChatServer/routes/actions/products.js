var async = require("async");
var moment = require("moment");
var _ = require('underscore');
var ObjectId = require('mongodb').ObjectID;


var Products  = function(app){
	this.conf = app.conf;
	this.db = app.dbconn;

};
module.exports = Products;




Products.prototype.producttypeslist = function(req, cbk){
	
	var self = this;
	var reqObj = req.query;
	
	
	var response = {
			status : false,
			err : null,
			data : null
		};
	
	self.db.collection('producttypes').find({}).toArray(function(err, result) {
		  if(!err && result.length>0){
				  response['status'] = true;
				  response['data'] = result;

				  console.log("producttypes response--------");
				  console.log(response);

				  cbk(response);
		  }
		  else{
			  response['err'] = 'No Products Type Found';

			  console.log("err producttypes response--------");
			  console.log(response);

			  cbk(response);
		  }
	});
	
};


Products.prototype.createProduct = function(req, cbk){
	
	var self = this;
	var insertObj = req.body;

	var response = {
		status : false,
		err : null,
		data : null
	};

		
	console.log(new Date() + " | products param ",insertObj)



	var ProductPhoto = req.files.file;


	insertObj['createdTime'] = new Date().getTime();

	var path = self.conf.photoPath +"/"+new Date().getTime()+".jpg";

	ProductPhoto.mv(path, function(err) {
	    if (err) {
	    	response['err'] = 'error in photo upload';
  			cbk(response)
	    }
	    else {

	    	insertObj['imgUrl'] = path;

	     	self.db.collection('products').insert(insertObj, function(err, result) {

				if(err){
					response['err'] = 'error in insertion';
					  cbk(response)
				}
				else{
                      response['status'] = true;
					  response['data'] = result;
					  cbk(response)
					  	

				}

				
			});
	    }
    });
	
	
};
Products.prototype.updateProduct = function(req, cbk){
	
	var self = this;
	var insertObj = req.body;

	var response = {
		status : false,
		err : null,
		data : null
	};

		
	console.log(new Date() + " | products param ",insertObj)
   insertObj['updatedTime'] = new Date().getTime();

    if(req.files!="" && req.files!=null){
        var ProductPhoto = req.files.file;




        var path = self.conf.photoPath +"/"+new Date().getTime()+".jpg";

        ProductPhoto.mv(path, function(err) {
            if (err) {
                response['err'] = 'error in photo upload';
                cbk(response)
            }
            else {

                insertObj['imgUrl'] = path;

                self.db.collection('products').update({_id:ObjectId(insertObj.id)},{ $set: insertObj}, function(err, result) {

                    if(err){
                        response['err'] = 'error in update';
                          cbk(response)
                    }
                    else{
                          response['status'] = true;
                          response['data'] = result;
                          cbk(response);


                    }


                });
            }
        });

    }
      else {

	    	self.db.collection('products').update({_id:ObjectId(insertObj.id)},{ $set: insertObj}, function(err, result) {

				if(err){
					response['err'] = 'error in update';
					  cbk(response)
				}
				else{
                      response['status'] = true;
					  response['data'] = result;
					  cbk(response);
					  	

				}

				
			});
	    }
	
	
};

Products.prototype.productslist = function(req, cbk){

	var self = this;
	var reqObj = req.query;


	var response = {
			status : false,
			err : null,
			data : null
		};


    if(req.query.productId){
        self.db.collection('products').findOne({_id:ObjectId(reqObj.productId)},function(err, result) {
              if(!err){
                      response['status'] = true;
                      response['data'] = result;
                      cbk(response);
              }
              else{
                  response['err'] = 'No Product Found';
                  cbk(response);
              }
        });
    }else if(req.query.userId){

        self.db.collection('products').find({userId:reqObj.userId}).toArray(function(err, result) {
              if(!err && result.length>0){
                      response['status'] = true;
                      response['data'] = result;
                      cbk(response);
              }
              else{
                  response['err'] = 'No Products Found';
                  cbk(response);
              }
        });
    }else{
        response['err'] = 'No Products Found';
          cbk(response);

    }
};

Products.prototype.deleteProduct = function(req, cbk){
	
	var self = this;
	var reqObj = req.body;
	
	
	var response = {
			status : false,
			err : null,
			data : null
		};

	
	if(reqObj.productId){
        self.db.collection('products').remove({_id:ObjectId(reqObj.productId)},function(err, result) {
              if(!err){
                      response['status'] = true;
                      response['data'] = result;
                      self.db.collection('collections').remove({productId:reqObj.productId},function(err, result) {
                        cbk(response);
                      });

              }
              else{
                  response['err'] = 'Error in Product Delete';
                  cbk(response)
              }
        });
    }else{
        response['err'] = 'Error in Product Delete';
        cbk(response);
    }
	
};
