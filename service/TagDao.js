var models = require('../model');
var Tag = models.Tag;

/**
 * 根据name获取标签
 * Callback:
 * - err, 数据库错误
 * - message, 消息对象
 * @param {String} id 文章ID
 * @param {Function} callback 回调函数
 */
exports.getArticleByName = function(name,callback){
	Tag.findOne({name:name},callback);
};

/**
 * 查找所有
 * Callback:
 * - err, 数据库异常
 * @param {Function} callback 回调函数
 */
exports.findAll = function(callback){
  Tag.find({}, callback);
};

/**
 * 新增标签
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name 名称
 * @param {Function} callback 回调函数
 */
exports.newAndSave = function (name,callback) {
  var tag = new Tag();
  tag.name=name;
  //先查找，如果存在就不再插入
  Tag.findOne({name:name},function(err,one){
  	if(!one){
  		tag.save(callback);		
  	}else{
  		console.log('tag exitst with the name:{}',name);
  		callback(err,tag);	
  	}
  });
};





