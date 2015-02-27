var EventProxy = require('eventproxy');
var UserDao = require('../service').UserDao;
var utils = require('../service/utils');
var base = require('./base');

/*注册页面*/
exports.reg = function(req, res){
	res.render('reg', {
		title: '注册'
	});
};

/*注册表单*/
exports.doReg = function(req, res, next){
	//非空检查
	if(req.body['password'] =='' || req.body['email'] ==''){
		req.flash('error',"必填项不能为空！");
		return res.redirect('/reg');
	}
	if(req.body['username'] =='' || req.body['username'] ==''){
		req.flash('error',"必填项不能为空！");
		return res.redirect('/reg');
	}

	//email不能重复
	UserDao.getUserByEmail(req.body['email'],function(err,user){
		if(err){
			req.flash('error',err);
			return res.redirect('/reg');
		}
		if(user){
			req.flash('error',"该用户已存在，请换一个邮箱");
			return res.redirect('/reg');
		}else{
			//可以注册
			UserDao.newAndSave(req.body['username'],req.body['email'],req.body['password'],function(err,user){
				if(err)	{
					req.flash('error',err);					
					return res.redirect('/reg');
				}
				//添加到session
				req.session.user = user;
				req.flash('success','注册成功');
				res.redirect('/login');	
			});
		}
	});
};

/*登陆页面*/
exports.login = function(req, res){
	//检查是否登录
	if(req.session.user){
		console.log('您已经登录');
		return res.redirect('/manage');
	}
	res.render('login', { 
  		title: '登陆'
  	});
};

/*登入表单*/

exports.doLogin = function(req, res,next){
	//检查是否登录
	base.checkLogin(req,res);
    //非空检查
	if(req.body['password'] ==='' || req.body['email'] === ''){
		req.flash('error','输入密码，邮箱不能为空！');
		return res.redirect('/login');
	}
	UserDao.getUserByEmail(req.body['email'],function(err,user){
		if(err){
			req.flash('error','数据库查询失败！');
			return res.redirect('/login');
		}
		if(user){
			if(user.pwd == utils.md5(req.body['password'])){
				//登陆成功
				req.session.user = user;
				return res.redirect('/manage');			
			}else{
				//密码输入错误
				req.flash('error','密码输入错误！');
				return res.redirect('/login');	
			}
		}else{
			req.flash('error','用户不存在！');
			return res.redirect('/login');
		}
	});
};

/*改密页*/
exports.pwd = function(req,res,next){
	if(!req.session.user){
		req.flash('error','改密请先登录！')
		return res.redirect('/login');
	}

	res.render('user/pwd',{
		title: '改密',
		layout:'default'
	});
};

/*改头像*/
exports.avatar = function(req,res,next){
	if(!req.session.user){
		req.flash('error','改密请先登录！')
		return res.redirect('/login');
	}

	res.render('user/avatar',{
		title: '修改头像',
		layout:'default'
	});
};

/*改头像*/
exports.updateAvatar = function(req,res,next){
	
	var result = {
		type : 'error',
		message : ''
	};
	
	//必须先登录
	if(!req.session.user){
		result.message = '必须先登录！';
		res.jsonp(result);
	}

	var avatar_url = req.body['avatar_url'];

	if(!avatar_url){
			result.type = 'error';
			result.message = '头像文件更新失败！';
			res.jsonp(result);
	}
	
	//后台验证
	UserDao.updateAvatar(req.session.user._id,avatar_url,function(err,user){
			if(!err && user != null){
				req.session.user = user;
				result.type = 'success';
				result.message = '头像更新成功！';
			}else{
				result.type = 'error';
				result.message = '头像更新失败！' + err;
			}
			res.jsonp(result);
	});			
};

/*改密*/
exports.updatePwd = function(req,res,next){
	
	var old_pwd = req.body['old_pwd'];
	var new_pwd = req.body['new_pwd'];

	var result = {
		type : 'error',
		message : ''
	};

	//必须先登录
	if(!req.session.user){
		result.message = '改密请先登录！' ;
		return res.jsonp(result);	
	}
	//新旧密码不一致
	if(old_pwd === new_pwd){
		result.type = 'error';
		result.message = '旧密码必须与新密码不一致！' ;
		return res.jsonp(result);
	}

	//后台验证
	UserDao.updatePwd(req.session.user._id,new_pwd,function(err,user){
		if(!err && user != null){
			req.session.user = user;
			result.type = 'success';
			result.message = '密码更新成功！';
		}else{
			result.type = 'error';
			result.message = '密码更新失败！' + err;
		}
		res.jsonp(result);
	});	
};

/*登出*/
exports.logout = function(req, res){
	req.session.user = null;
	req.flash('success','登出成功！');		
    res.redirect('/index');
};

