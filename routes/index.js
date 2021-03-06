
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

	// res.render('index', { title: "express" });

	stories.getLatest(count + 1, skip, function(err, items){
		if(err){
			res.send(500);
			console.log('cannot retrive stories');
			console.log(err);
			return;
		}

		var nextPage = null;
		if(items.length > count){
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
			user: req.session.user || null,
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





//記事の作成
exports.create = function(req, res) {
  if (req.session.user === undefined) {
    res.redirect(403, '/');
    return;
  }
  res.render('create-story', {
    story: {},
    page: { title: 'New Story' },
    user: req.session.user,
    error: 200
  });
};

// 記事の作成フォームを受け付ける
exports.create.post = function(req, res) {
  if (req.session.user === undefined) {
    res.redirect(403, '/');
    return;
  }
  var story = {};
  story.title = req.body.title;
  story.slug = req.body.slug;
  story.body = req.body.body;

  stories.insert(story, function (err) {
    if (err) {
      res.send(500);
      return;
    }
    res.redirect('/');
  });
};


// artilce details
exports.single = function (req, res){
	stories.getBySlug(req.params.slug, function(err, item) {
		if(err){
			res.send(500);
			console.log('cannot retrieve stories');
			console.log(err);
			return;
		}
		if(item === null){
			res.send(404);
			return;
		}
		res.render('single', {
			page: { title: 'nblog-RE' },
			user: req.session.user || null,
			story: item
		});
	});
};





