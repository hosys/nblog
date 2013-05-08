user.authenticate = function(name, password, callback){
	db.query('SELECT * FROM users WHERE name = ?',
		[name], queryCallback);
};