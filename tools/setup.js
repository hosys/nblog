var users = require("../models/users");

var name = 'admin';
var password = 'admin';

users.createUser(name, password, function(err, sid){
	if(err){
		console.log('user creation failed.');
	}
	console.log('user ' + name + ' created. sid: ' + sid);
});