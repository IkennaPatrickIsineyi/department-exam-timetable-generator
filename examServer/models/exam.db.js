//models/exam.db.js
//import sqlite3 module
const sqlite=require('sqlite3').verbose()
//connect to file database
const connection= new sqlite.Database('./examdb.db',
(error)=>{
	if(error){
		console.log('error occurred in database connection', error); 
		}
	else{
		console.log('database connection created...');
		connection.get('pragma foreign_keys=on');
		}
	});
//export connection
module.exports=connection;