
/**
 * Module dependencies.
 */
var ndir = require('ndir');
var bodyParser = require('body-parser');

var express = require('express')
  , router = require('./router')
  , editor = require('./editor')
  , http = require('http')
  , path = require('path')
  , config = require('./config')
  , partials = require('express-partials')//为了使用ejs模 版
  , flash = require('connect-flash');//使用flash(flash是express的工具，
                                    //通过它保存的变量只会在当前用户
                                    //的下一次请求中被访问到，之后会被清除)

var app = express();
var maxAge = 3600000 * 24 * 30;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
//ueditor
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.configure(function(){
  app.use(express.cookieParser(config.auth_cookie));
  app.use(express.session({ cookie: { maxAge: maxAge },secret:config.session_secret}));
  app.use(flash());
});

//为了使用ejs模版
app.use(partials());
/**把变量和运算分开，这样很重要**/
app.use(function(req, res, next) {    
    var error = req.flash('error');
    res.locals.error = error.length ? error:null;
    var success = req.flash('success');
    res.locals.success = success.length ? success:null;
    res.locals.user = req.session ? req.session.user : null;
    next();
});

//controller
app.use(app.router);

//route
router(app);
//editor
editor(app);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//create server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
