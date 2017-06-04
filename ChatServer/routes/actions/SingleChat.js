var SingleChat = function(app){
    this.db = app.dbconn;
};

module.exports = SingleChat;


SingleChat.prototype.storeMessage = function(req, cbk){
    var self = this;
    var response = {
        status : false,
        err : null,
        data : null
    };
    var reqObj = req.body;
    cbk("Data Inserteddd")
    /*self.db.collection('users').insert({username:username}, function(err, result) {
        if(!err && result){

        }
        else{
            response['err'] = 'No User Found';
            cbk(response)
        }
    });*/
    /*self.db.collection('products').insert(insertObj, function(err, result) {
     if(err){
     response['err'] = 'error in insertion';
     cbk(response)
     }
     else{
     response['status'] = true;
     response['data'] = result;
     cbk(response)
     }
     });*/

};
