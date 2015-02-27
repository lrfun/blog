var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	name: { type: String,index:true },//使用索引，便于查询
	pwd:{type:String},
	email:{type:String,index:true },
	avtar:{type:String},
	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },	
});

mongoose.model('User', UserSchema);