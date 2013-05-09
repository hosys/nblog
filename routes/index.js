
/*
 * GET home page.
 */

var users = require('../models/users');
var stories = require('../models/stories');


// view index page

exports.index = function(req, res){
	var pageNum = Number(req.query.page) || 1;
	var count = 10;
	var skip = count * (pageNum - 1);

	stories.getLatest(count + 1, skip, function(err, items){
		if(err){
			res.send(500);
			console.log('cannot retrive stories');
			console.log(err);
			return;
		}

		var nextPage = null;
		if(item.length > count){
			nextPage = '/?page=' + (pageNum + 1);
			items.pop();
		}

		var previousPage = null;
		if(skip > 0){
			if(pageNum == 2){
				previousPage = '/';
			} else {
				previousPage = '/?page=' + (pageNum - 1);
			}
		}

		var params = {
			page: {
				title: 'nblog',
				next: nextPage,
				previous: previousPage
			},
			user: req.sesssion.user || null,
			stories: items,
			request: req
		};

		res.render('index', params);

	});
};


// view login

exports.login = function(req, res){
	res.render('login', {
		page: { title: 'login' },
		user: null,
		name: '',
		error: 200,
		loginFailed: false
	});
	return;
};


// view login-post

exports.login.post = function(req, res){
	var name = req.body.name || '';
	var password = req.body.password || '';

	function authCallback(err, userInfo){
		if(err || userInfo === null){
			res.render('login', {
				page: { title: 'login' },
				user: null,
				name: name,
				error: 200,
				loginFailed: true
			});
			return;
		}

		req.session.user = {		
			uid: userInfo.uid,
			name: userInfo.name
		};
		res.redirect('/');
		return;
	}

	users.authenticate(name, password, authCallback);
};


// view logout

exports.logout = function(req, res){
	req.session.destroy(function(err){
		res.redirect('/');
	});
};














