var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ArticleSchema = new Schema({
	title: { type: String, index: true },//标题信息
	description:{type:String,index:true},
	content:{type:String},
	author:{type: String},
	tags:{type:String,index:true},//标签，使用,隔开
	author_email:{type: String},
	click_count:{ type: Number, default: 0 },//点击数
	ask_count:{ type: Number, default: 0 },//访问数量

	create_at: { type: Date, default: Date.now },
  	update_at: { type: Date, default: Date.now }

});

mongoose.model('Article', ArticleSchema);