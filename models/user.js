var restful = require('node-restful');
var mongoose = restful.mongoose;

//Schema
var userSchema = new mongoose.Schema({
	Email : String,
	Password : String,
	Admin : Boolean
});

//Connection between the model and the schema
module.exports = mongoose.model('user', userSchema);
