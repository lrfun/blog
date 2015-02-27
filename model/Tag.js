var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TagSchema = new Schema({
	name: { type: String },
	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },	
});

mongoose.model('Tag', TagSchema);