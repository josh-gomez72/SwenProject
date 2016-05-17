var express = require('express');
var router = express.Router();
// var pg = require('pg').native; //used for lab machines
var pg = require('pg'); //used for windows

// var database = "postgres://gomezjosh:password@depot:5432/SwenGroup9";
 var database = "postgres://tihxgzxemzbafr:hiCzGMi1vENgac3Cmd-UyZDeZ-@ec2-54-235-208-3.compute-1.amazonaws.com:5432/defa0fcjs2b02k?ssl=true";
 var client = new pg.Client(database);
 client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/login');
});

 pg.connect(database, function(err, client, done){
 	if(err){
 		console.error('Could not connect to the database');
 		console.error(err);
 		return;
 	}

 	console.log('Connected to database: SwenGroup9');
 	client.query("SELECT * FROM Items;", function(error, result){
 	done();
 	if (error){
 		console.error('Failed to execute query');
 		console.error(error);
 		return;
 		}
 	console.log("RESULT: " + JSON.stringify(result.rows));
 	});
 });

router.get('/register', function(req, res, next){
	res.render('register', {title: 'Register User'});
});

router.get('/login', function(req, res, next){
	res.render('login', {title: 'Login'});
});

router.get('/login/confirmation', function (req, res, next){
	console.log(req.query)
	var username = req.query.username;
	var password = req.query.password;
	
	client.query("")	
	
});

router.get('/browse/category', function(req, res, next){
	console.log(req.query.category);
	var queryString = "SELECT * FROM items WHERE category = '" + req.query.category + "' OR parent_category = '" + req.query.category + "';"
	console.log(queryString);
	var query = client.query(queryString, function (error, result) {
		if (error){ console.log(error);}
		else {
			console.log(result.rows)
			res.render('browseCategory', {title: 'List of items', resultPlace: result.rows});
			}
	}		
	);
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

	//Very annoying that I can't put new lines in this command otherwise it cant run because it sees it as an unexpected token
	var query = client.query("INSERT INTO Users (username, fname, lname, password, email, address, city, postcode, phone) VALUES ('" + username + "' , '" + fname + "' , '" + lname + "' , '" + password + "' , '" + email + "' , '" + address + "' , '" + city + "' , '" + postcode + "' , '" + phone + "');", function(error, result){
		//done(); need to call this somehow but not sure how we do proper queries yet
		if (error){
			console.error('Failed to execute INSERT query');
			console.error(error);
			return;
			}
		console.log(result);
	});
	//Very annoying that I can't put new lines in this command otherwise it cant run because it sees it as an unexpected token
	console.log(query.text);
	res.render('regconfirm', {title: 'Confirmation!'});
});

module.exports = router;
