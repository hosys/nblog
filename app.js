
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');

var MemcachedStore = require('connect-memcached')(express);
var config = require('./config');


/**
 * Setup app object
 */

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.cookieParser(config.cookieHash));
  app.use(express.session({
    key: 'session',
    store: 'new MemchachedStore()'
  }));

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


/**
 * Setup routing
 */

app.configure('development', function(){
  app.use(express.errorHandler());
});



// login 
app.get(('/login', routes.login));
app.post(('/login', routes.login.post));

// logout
app.get(('/logout', routes.logout));

// create article
app.get(('/create', routes.create));
app.post(('/create', routes.create.post));

// View airticle
app.get(('/:slug', routes.login));
app.get('/', routes.index);


app.get('/users', user.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});






