var express = require('express');
var router = express.Router();
var pg = require('pg').native;

var database = "postgres://gomezjosh:password@depot:5432/SwenGroup9";
var client = new pg.Client(database);
client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Farmers Market' });
});

pg.connect(database, function(err, client, done){
	if(err){
		console.error('Could not connect to the database');
		console.error(err);
		return;
	}

	console.log('Connected to database: SwenGroup9');
	client.query("SELECT * FROM Users;", function(error, result){
	done();
	if (error){
		console.error('Failed to execute query');
		console.error(error);
		return;
		}
	console.log(result);
	});
});

router.get('/register', function(req, res, next){
	res.render('register', {title: 'Register User'});
});

router.get('/register/confirmation', function(req, res, next){
	//res.send(req);
	var fname = req.query.firstname;
	var lname = req.query.lastname;
	var username = req.query.username;
	var password = req.query.password;	
	var email = req.query.email;
	var address = req.query.address;
	var city = req.query.city;
	var postcode = req.query.postcode;
	var phone = req.query.phoneNumber;
	
	console.log(req.query.firstname);
	var query = client.query("INSERT INTO Users (username, fname, lname, password, email, address, city, postcode, phone) VALUES ('" + username + "' , '" + fname + "' , '" + lname + "' , '" + password + "' , '" + email + "' , '" + address + "' , '" + city + "' , '" + postcode + "' , '" + phone + "');");
	//Very annoying that I can't put new lines in this command otherwise it cant run because it sees it as an unexpected token
	//
	console.log(query.text);	
	res.render('regconfirm', {title: 'Confirmation!'});
	console.log("Something happened");
});

module.exports = router;
