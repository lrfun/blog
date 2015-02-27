var EventProxy = require('eventproxy');
var articleDao = require('../service').ArticleDao;
var tagDao = require('../service').TagDao;
var utils = require('../service/utils');
var base = require('./base');

/**
 * 首页 
 */
exports.index = function(req, res,next){
	var proxy = new EventProxy();
	proxy.fail(next);
	
	articleDao.findAll(function(err,articles){
		//定义返回事件
	    proxy.after('formateDate',articles.length,function(list){
			res.render('index', { title: '首页',layout:'default',articles:list,type:1});     
		});

		//处理创建时间
		articles.forEach(function(article,a){
	    	formate(article);
	        proxy.emit('formateDate',article);
	    });		
	});
};

/**
 * 编辑文章 
 */
exports.post = function(req, res,next){
	if(!req.session.user){
		console.log('请先登录');
		return res.redirect('/login');
	}
	res.render('post', { title: '编辑文章',layout:'default',user:req.session.user,type:0});
};

/**
 * 编辑文章表单请求 
 */
exports.doPost = function(req, res,next){
	if(!req.session.user){
		console.log('请先登录');
		return res.redirect('/login');
	}

    var tagStr = req.body['tags'];
	var tagArr = utils.toArr(tagStr,",");
	
	//定义事件
	var proxy = new EventProxy();
	proxy.fail(next);
	//定义返回事件
    proxy.after('saveAll',tagArr.length,function(list){
		req.flash("success","发布成功！");
		return res.redirect('/index');
	});	

	//1：保持文章	
	articleDao.newAndSave(
		req.body['title'],
		req.body['description'],
		req.body['content'],
		req.body['author'],
		req.body['email'],
		tagStr,	
		function(err){
			if(err){
				console.log(err);
				req.flash("error",err);
				return res.redirect('/error');
			}
			console.log('save article ok..');
			//2：保持标签
			tagArr.forEach(function(tag,a){
		    	tagDao.newAndSave(tag,function(error){
		            if(error){
		            	console.log(error);
						req.flash("error",error);
						return res.redirect('/error');
					}
		    		proxy.emit('saveAll',tag);	
		    	});
		    });	
		});
};

/**
 * 编辑文章 
 */
exports.archives = function(req, res,next){
	var proxy = new EventProxy();
	proxy.fail(next);

	articleDao.findAll(function(err,articles){
		//定义返回事件
	    proxy.after('formateDate',articles.length,function(list){
			res.render('archives', { title: '文章归档',layout:'default',articles:list,type:2});
		});
		
		//处理创建时间
		articles.forEach(function(article,a){
	    	formate(article);
	        proxy.emit('formateDate',article);
	    });		
	});
};

/**
 * 详情 
 */
exports.detail = function(req,res,next){
  var id = req.params.id;
  articleDao.getArticleById(id,function(err,article){
  		formate(article);
  		res.render('detail',{ title:article.title,layout:'default',article:article,type:0});	
  });	
};

/**
 * 更新文章信息
 */
exports.update = function(req,res,next){
	if(!req.session.user){
		console.log('请先登录');
		return res.redirect('/login');
	}
	var id = req.params.id;
	articleDao.getArticleById(id,function(err,article){
			formate(article);
			res.render('update',{ title:article.title,layout:'default',article:article,type:0});	
	});	
};

/**
 * 更新文章信息
 */
exports.doUpdate = function(req,res,next){
	if(!req.session.user){
		console.log('请先登录');
		return res.redirect('/login');
	}

    var id = req.body['id'];
    var content = req.body['content'];
	var tags  = req.body['tags'];
	var description  = req.body['description'];
	articleDao.update(id,content,tags,description,function(error,article){
		if(error){
			req.flash("error",error);
			return res.redirect('/error');
		}
		req.flash("success",'更新操作成功！');
		return res.redirect('/index');
	});		
};

/**
 * 关于页面
 */
exports.about = function(req,res,next){
  res.render('about',{ title: '文章归档',layout:'default',type:3});
};

/**
 * 错误
 */
exports.error = function(req,res,next){
  res.render('error',{ title: '出错啦',layout:'default',type:0});
};

/**
 * 文章管理
 */
exports.manage = function(req,res,next){
	if(!req.session.user){
		console.log('请先登录');
		return res.redirect('/login');
	}
	var name = req.session.user.name;
	var condition = {};
	condition['author'] = name;
	if(name == 'admin'){
		//查全部
		condition = {};
	}
	console.log('condition:{}',condition);
	//查询
	articleDao.getArticlesByQuery(condition,{},function(err,articles){
		res.render('admin/manage',{ title: '文章管理',articles:articles});
	});
};

/**
 * 错误
 */
exports.del = function(req,res,next){
   if(!req.session.user){
		console.log('请先登录');
		return res.redirect('/login');
	}

   var id = req.params.id;
   articleDao.remove(id,function(err,msg){
   		if(err){
			req.flash("error",error);
			return res.redirect('/error');
		}
		req.flash("success",'删除操作成功！');
		return res.redirect('/manage');
   });
};

/**
 * 检索标签
 */
exports.tag = function(req,res,next){
	var proxy = new EventProxy();
	proxy.fail(next);
	var name = req.params.tagName;
	
	var condition = {};
	condition['tags'] = new RegExp(name);//模糊查询参数

	articleDao.getArticlesByQuery(condition,{limit:100},function(err,articles){
		//定义返回事件
	    proxy.after('formateDate',articles.length,function(list){
			res.render('tags', { title: '标签',layout:'default',articles:list,type:0,tagName:name});
		});

		//处理创建时间
		articles.forEach(function(article,a){
	    	formate(article);
	        proxy.emit('formateDate',article);
	    });		
	});
};

/**
 * 检索标题
 */
exports.search = function(req,res,next){
	var proxy = new EventProxy();
	proxy.fail(next);
	var keywords = req.body['keywords'];
	
	var condition = {};
	condition['title'] = new RegExp(keywords);//模糊查询参数
		
	articleDao.getArticlesByQuery(condition,{limit:100},function(err,articles){
		//定义返回事件
	    proxy.after('formateDate',articles.length,function(list){
			res.render('search', { title: '搜索',layout:'default',articles:list,type:0,keywords:keywords});
		});

		//处理创建时间
		articles.forEach(function(article,a){
	    	formate(article);
	        proxy.emit('formateDate',article);
	    });		
	});
};



/**
 * 格式化文章内容
 */
function formate(article){
	article.createdAt = utils.format_date(article.create_at);
	article.tagArr = utils.toArr(article.tags);
}

//+++++++++++++++++++++++++++
//工具方法
//+++++++++++++++++++++++++++

/**如果已经登入了,就转到首页**/
function checkLogin(req,res){
	if(req.session.user)
		return res.redirect('/manage');
}

/**如果已经登入了,就转到首页**/
function mustLogined(req,res){
	if(!req.session.user)
		return res.redirect('/login');
}