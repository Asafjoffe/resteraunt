var restful = require('node-restful');
var mongoose = restful.mongoose;

//Schema
var ProductSchema = new mongoose.Schema({
    id: Number,
    img: String,
    name: String,
    price: Number,
    desc: String
});
//Connection between the model and the schema
module.exports = mongoose.model('product', ProductSchema);
