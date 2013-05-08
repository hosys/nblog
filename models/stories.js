stories.getLatest = function(count, skip, callback){
	if('function' === typeof skip){
		callback = skip;
		skip = undefined;
	}
	skip = skip | 0;
	db.query('SELECT * FROM stories ORDER BY cdata DESC LIMIT ?, ?;', 
		[skip, count], 
		function(err, results, fields){
			db.end();
			if(err){
				callback(err);
				return;
			}
			callback(null, results);
		});
};