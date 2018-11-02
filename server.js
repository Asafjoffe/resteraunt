// npm Modules
var express = require ('express');
var bodyParser = require ('body-parser');
var path = require ('path');

// My Modules
var mongoose = require('./myModules/myMongoose');
var mongooseDetails = {
	"username": "AsafJoffe",
	"password": "asafjoffe3",
	"host": "ds135089.mlab.com",
	"port": "35089",
	"databaseName": "restaurent"
}
mongoose.connect(
	mongooseDetails.username,
	mongooseDetails.password,
	mongooseDetails.host,
	mongooseDetails.port,
	mongooseDetails.databaseName);

 var app = express();
 app.use(bodyParser.urlencoded({extended : true}));
 app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "www")));

//Using static files 
 app.use('/api', require('./routes/api'));


app.get('/', function (req, res) {
 	res.redirect('/index.html');
 });

 app.listen(3000);
 console.log('App is lisetning on port 3000');
