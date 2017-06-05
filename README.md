# mean-init

#Bakcup/Restore Mongo db

Backup DB <br/>
mongodump -d <database_name> -o <directory_backup>  <br/>

Restore DB<br/>
Create forder for db<br/>
mongorestore -d <database_name> <directory_backup> <br/>

ex:
mean-init\ChatServer>mongorestore -d demodb data/demodb  <br/>


# Run Mongo DB :

Server:

Install Mongo DB Server <br/>
Set 'up to bin' mongo db path <br/>
Run: <br/>
mongod --dbpath "<database path>" <br/>
For auth: <br/>
mongod --auth --dbpath "<database path>" <br/>

Client:<br/>

To start: <br/>
mongo <br/>

Some commands: <br/>
show dbs <br/>
show collections <br/>
show tables <br/>
use dbname <br/>
db.auth("username","password") <br/>
db.users.find().pretty() <br/>
db.user.find({"key":"value"}).pretty() <br/>
db.user.insert({"key":"value"}) <br/>


# Node Server

Locate package.json in cmd prompt, and run "npm install" <br/>
node app.js <br/>


# Client Angular App
Run Index using any light weight web server <br/>
Socket works only in server <br/>
