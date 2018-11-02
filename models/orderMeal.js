var restful = require("node-restful");
var mongoose = restful.mongoose;

//Schema
var orderMealSchema = new mongoose.Schema({
  User: String,
  Products: Array
});

//Connection between the model and the schema
module.exports = mongoose.model("orderMeal", orderMealSchema);
