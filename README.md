# mean-init

#Bakcup/Restore Mongo db

Bakcup DB
mongodump -d <database_name> -o <directory_backup>

Restore DB
Create forder for db
mongorestore -d <database_name> <directory_backup>
ex:
mongorestore -d demodb /data/demodb/


# Run Mongo DB :

Server:

Install Mongo DB Server
Set 'up to bin' mongo db path
Run:
mongod --dbpath "<database path>"
For auth:
mongod --auth --dbpath "<database path>"

Client:
To start:
mongo 

Some commands:
show dbs
show collections
show tables
use dbname
db.auth("username","password")
db.users.find().pretty()
db.user.find({"key":"value"}).pretty()
db.user.insert({"key":"value"})


# Node Server
node app.js


# Client Angular App
Run Index using any light weight web server 
Socket works only in server
