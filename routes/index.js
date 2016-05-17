var express = require('express');
var router = express.Router();
var pg = require('pg').native; //used for lab machines
//var pg = require('pg'); //used for windows

// var database = "postgres://gomezjosh:password@depot:5432/SwenGroup9";
 var database = "postgres://tihxgzxemzbafr:hiCzGMi1vENgac3Cmd-UyZDeZ-@ec2-54-235-208-3.compute-1.amazonaws.com:5432/defa0fcjs2b02k";
 var client = new pg.Client(database);
 client.connect();
 
 /** Testing variables */
 var loggedUser = null;
 var cart = [];		// {item:a, seller:b, quantity:c}
 var cartCost = 0;
 var resultsPerPage = 10;
 /** Testing variables end */

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/login');
});

/** Testing pages */
router.get('/indexTEST', function(req, res, next) {
	if (loggedUser == null){	// User's not logged in, redirect to login page
	  res.redirect('loginTEST');
	}
	else {				// user's already logged in. Show home page.
	  res.render('indexTEST', {title: 'The Market', user: loggedUser, cart: cart.length});
	}
});

router.get('/logoutTEST', function(req, res, next) {
	loggedUser = '';
	cart = [];
	res.redirect('loginTEST');
});

router.get('/loginTEST', function(req, res, next) {
	var err = 'Username or password incorrect. Please try again.';
	// Query for existing username
	if (req.query.username){
		// Query database for user. If user exists, allow login.
		var query = client.query("SELECT username,password FROM Users WHERE username = '" + req.query.username + "';", function (error, result) {
			if (error){ console.log(error);}
			else {
				if (result.rows.length > 0){	// A user exists with this name. Log in.
					loggedUser = req.query.username;
					cartSize = 0;
					cart = [];
					err = '';
				}
			}
		});
	} else { err = ''; }
	// If successful, log in. If not, redirect with error message.
	if (loggedUser == null){	// User did not successfully log in
	  res.render('loginTEST', {title: 'The Market', user:loggedUser, cart:cart.length, err: err});
	}
	else {
	  res.redirect('indexTEST');
	}
	
});

router.get('/cartTEST', function(req, res, next) {		// Viewing the contents of the cart
	var cartFull = [];
	for (i in cart){
		var queryStr = "SELECT * FROM items WHERE seller = '" + cart[i].seller + "' AND name = '" + cart[i].item + "';";
		var query = client.query(queryStr, function (error, result) {
			if (error){ console.log(error);}
			else {
				console.log(result.rows)
				cartFull.push({result:result.rows, quantity:cart[i].quantity});
			}
		});
	}
	res.render('cartTEST', {title: 'The Market', user:loggedUser, cart:cart.length, list:cartFull, cost: cartCost});
});

router.get('/searchTEST', function(req, res, next) {
	//console.log("Search Test");
	// limit 10 offset 20			10 results from row 20
	var queryStr = "SELECT * FROM items WHERE name = '" + req.query.search + "';"
	var query = client.query(queryStr, function (error, result) {
		if (error){ console.log(error);}
		else {
			res.render('searchTEST', {title: 'The Market', user:loggedUser, cart:cart.length, list:result.rows, cost: cartCost});
		}
	});
	//res.redirect('indexTEST');
});

router.get('/addToCartTEST', function(req, res, next) {
	// req.body.item		should return full result
	var itm = req.query.item;
	console.log(req.query.item.toString())
	console.log(itm.name);
	console.log(itm.category);
	cart.push({item:itm.name, seller:itm.seller, quantity:1});
	cartCost += 0;		// Check cost of item when adding it
	console.log(cart);
	res.redirect('indexTEST');
});

router.get('/paymentTEST', function(req, res, next) {
	// ... show page requesting payment information (credit card & address)
	res.redirect('indexTEST');
});

router.get('/purchaseTEST', function(req, res, next) {
	// ... Remove purchased items from database
	res.redirect('indexTEST');
});

router.get('/removeFromCartTEST', function(req, res, next) {
	// ... Remove an item from the cart
	res.redirect('indexTEST');
});
/** End of testing pages */

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
