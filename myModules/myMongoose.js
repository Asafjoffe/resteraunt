// My Modules
var mongoose = require ('mongoose');

function connect(username, password,host, port, databaseName) {
	mongoose.Promise = global.Promise;
	var url = `mongodb://${username}:${password}@${host}:${port}/${databaseName}`;

	 // var url = "mongodb://localhost/TEST";cd 
 mongoose.connect(url, { server: { useNewUrlParser : true }}, (err) =>{
	if(err){
		console.log("error", err);
	} 
	else{
		console.log("connected to monogoDB");
	}
 });

}


module.exports = {
	"connect" : connect
}