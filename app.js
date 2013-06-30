
/**
 * Module dependencies.
 */

var express        = require('express');
var routes         = require('./routes');
var http           = require('http');
var path           = require('path');

var MemcachedStore = require('connect-memcached')(express);
var config         = require('./config');

/**
 * Setup app object
 */

var app            = express();

// env
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.cookieParser(config.cookiesHash));
  app.use(express.session({
    key: 'session',
    store: new MemcachedStore()
  }));

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


// dev
app.configure('development', function(){
  app.use(express.errorHandler());
});



/**
 * Setup routing
 */

// login 
app.get('/login', routes.login);
app.post('/login', routes.login.post);

// logout
app.get('/logout', routes.logout);

// create article
app.get('/create', routes.create);
app.post('/create', routes.create.post);

// View airticle
app.get('/:slug', routes.single);
app.get('/', routes.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});






