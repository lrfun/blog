﻿
var path = require('path');

module.exports = {
	version:'0.0.1',
	session_secret:'session.lrfun.com',
	auth_cookie: 'cookies.lrfun.com',
	db:'mongodb://127.0.0.1/lrfun',//mongodb://127.0.0.1/lrfun
	host:'localhost',
	page_size:10,
	rss:{
		    title: "lrfun’blog with node.js",
		    link: 'http://cnodejs.org',
		    language: 'zh-cn',
		    description: 'lrfun@github',
		    //最多获取的RSS Item数量
		    max_rss_items: 50
	},
	upload_dir: path.join(__dirname, 'public', 'user_data')
};