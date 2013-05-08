user.authenticate = function(name, password, callback){
	db.query('SELECT * FROM users WHERE name = ?',
		[name], queryCallback);
	function queryCallback(err, results, fields){
		db.end();
		if(err){
			callback(err);
			return;
		}
		if(results && (results.length > 0)){
			userInfo = results[0];
			if(userInfo.password == _hashPassword(password)){
				delete userInfo.password;
				callback(null, userInfo);
				return;
			}
		}
		callback(err, null);
		return;
	}


	function _hashPassword(password){
		if(password === ''){
			return '';
		}
		var shasum = crypto.createHash('sha256');
		shasum.update(password);
		return shasum.digest('hex');
	}

};