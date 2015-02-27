var models = require('../model');
var User = models.User;
var utils = require('./utils');

/**
 * 根据name获取用户
 * Callback:
 * - err, 数据库错误
 * @param {String} email 邮箱
 * @param {Function} callback 回调函数
 */
exports.getUserByEmail = function(email,callback){
	User.findOne({email:email},callback);
};

/**
 * 根据name获取用户
 * Callback:
 * - err, 数据库错误
 * @param {String} name 姓名
 * @param {Function} callback 回调函数
 */
exports.login = function(email,pwd,callback){
  pwd = utils.md5(pwd);
  User.findOne({email:email,pwd:pwd},callback);
};

/**
 * 新增用户
 * Callback:
 * - err, 数据库异常
 * @param {String} name 名字
 * @param {String} pwd 密码
 * @param {String} email 邮件
 * @param {String} avatar 头像
 * @param {Function} callback 回调函数
 */
exports.newAndSave = function (name,email,pwd, callback) {
  var user = new User();
  
  user.name=name;
  user.pwd=utils.md5(pwd);
  user.email=email;
  //user.avatar=avatar;
  
  user.save(callback);
};

/**
 * 跟新用户头像
 * Callback:
 * - err, 数据库异常
 * - user, 用户列表
 * @param {String} id id
 * @param {String} avatar_url 头像url
 * @param {Function} callback 回调函数
 */
exports.updateAvatar = function(id,avatar,callback){
  
  User.findOne({_id: id}, function(err,user){  
    if(err){
      return callback(err);
    }
    if(!user){
      return callback(new Error('该用户已经不存在！！'));
    }
    user.is_avatar = true;
    user.avatar = avatar;
    user.save(callback);
  });
};

/**
 * 跟新用户密码
 * Callback:
 * - err, 数据库异常
 * - user, 用户列表
 * @param {String} id id
 * @param {String} pwd 密码
 * @param {Function} callback 回调函数
 */
exports.updatePwd = function(id,pwd,callback){
  User.findOne({_id: id}, function(err,user){
    
    if(err)
      return callback(err);
    if(!user)
      return callback(new Error('该用户已经不存在！！'));
    
    user.pwd = pwd;
    user.save(callback);

  });
};
