//+++++++++++++++++++++++++++
//工具方法
//+++++++++++++++++++++++++++

/**如果已经登入了,就转到首页**/
exports.checkLogin = function (req,res){
	if(req.session.user){
		console.log('您已经登录');
		return res.redirect('/manage');
	}
}

/**如果已经登入了,就转到首页**/
exports.mustLogined = function (req,res){
	if(!req.session.user){
		console.log('请先登录');
		return res.redirect('/login');
	}
}

/***删除左右两端的空格**/
exports.trim = function (str){
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
