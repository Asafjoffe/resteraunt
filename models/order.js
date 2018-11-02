var restful = require('node-restful');
var mongoose = restful.mongoose;

//Schema
var orderSchema = new mongoose.Schema({
	Name : String,
	Phone : Number,
	NumberOfDiners : Number,
	Datetime : Date,
	Smokers : Boolean
});

//Connection between the model and the schema
module.exports = mongoose.model('order', orderSchema);
