var restful = require('node-restful');
var mongoose = restful.mongoose;

//Schema
var mealSchema = new mongoose.Schema({
	Pasta : Boolean,
	Rice : Boolean,
	Salad : Boolean,
	Mashedpotato : Boolean
});

//Connection between the model and the schema
module.exports = mongoose.model('meal', mealSchema);
