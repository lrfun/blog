var index = require('./routes/index');
var user = require('./routes/user');

module.exports = function(app){
	app.get("/index",index.index);
	app.get("/",index.index);
	app.get("/post",index.post);
	app.post("/article/post",index.doPost);

	app.get("/archives",index.archives);
	app.get("/detail/:id",index.detail);
	app.get("/update/:id",index.update);
	app.get("/del/:id",index.del);

	app.post("/update",index.doUpdate);
	app.get("/manage",index.manage);

	app.get("/about",index.about);
	app.get("/error",index.error);
	app.get("/tag/:tagName",index.tag);
	app.post("/search",index.search);


	app.get("/login",user.login);
	app.post("/login",user.doLogin);
	app.get("/reg",user.reg);
	app.post("/reg",user.doReg);
	app.get("/logout",user.logout);
}