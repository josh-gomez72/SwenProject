var express = require('express');
var router = express.Router();
var pg = require('pg').native; //used for lab machines
//var pg = require('pg'); //used for windows

<<<<<<< HEAD
//var database = "postgres://gomezjosh:password@depot:5432/SwenGroup9";
var database = "postgres://tihxgzxemzbafr:hiCzGMi1vENgac3Cmd-UyZDeZ-@ec2-54-235-208-3.compute-1.amazonaws.com:5432/defa0fcjs2b02k?ssl=true";
var client = new pg.Client(database);
client.connect();

router.get('/', function(req, res, next) {
	res.redirect('/browse');
});

=======
// var database = "postgres://gomezjosh:password@depot:5432/SwenGroup9";
 var database = "postgres://tihxgzxemzbafr:hiCzGMi1vENgac3Cmd-UyZDeZ-@ec2-54-235-208-3.compute-1.amazonaws.com:5432/defa0fcjs2b02k?ssl=true";
 var client = new pg.Client(database);
 client.connect();

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
	loggedUser = null;
	cart = [];
	cartCost = 0;
	res.redirect('loginTEST');
});

router.get('/loginTEST', function(req, res, next) {
	// Query for existing username
	if (req.query.username){
		// Query database for user. If user exists, allow login.
		var query = client.query("SELECT  FROM Users WHERE username = '" + req.query.username + "';", function (error, result) {
			if (error){ console.log(error);}
			else {
				if (result.rows.length > 0){	// A user exists with this name, successful login.
					loggedUser = req.query.username;
					cartSize = 0;
					cart = [];
					res.redirect('indexTEST');
				}
				else {	// No existing username, fail to log in.
					res.render('loginTEST', {title: 'The Market', user:loggedUser, cart:cart.length, err: 'Username or password incorrect. Please try again.'});
				}
			}
		});
	} else {		// no username was passed in.
		res.render('loginTEST', {title: 'The Market', user:loggedUser, cart:cart.length, err: ''});
	}
	
});

router.get('/cartTEST', function(req, res, next) {
	// Updated so all info remains in the cart, don't need to pull from db
	res.render('cartTEST', {title: 'The Market', user:loggedUser, cart:cart.length, list:cart, cost: cartCost});
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

/* Requires item:itemid. Optional quantity:digit. 
	Adds an object to the cart by itemID, or increments quantity if already in cart.*/
router.get('/addToCartTEST', function(req, res, next) {
	var found = false;
	// Store quantity to add
	var quan = 1;
	if (req.query.quantity > 1){ quan = req.query.quantity; }
	// Check if item exists in cart already
	for (i = 0; i < cart.length; i++){
		if (cart[i].id==req.query.item){	// Item exists, increment the quantity and cost.
			cart[i].quantity = +cart[i].quantity + +quan;
			var price = (cart[i].item[0].price).replace(/[^\d.-]/g, '');
			var totalCost = price * quan;
			cartCost += totalCost;
			found = true;
		}
	}
	// Item does not exist in cart. Must add it.
	if (found == false){
		var queryStr = "SELECT * FROM items WHERE itemid = '" + req.query.item + "';"
		var query = client.query(queryStr, function (error, result) {
			if (error){ console.log(error);}
			else {
				cart.push({id: req.query.item, item:result.rows, quantity:quan});
				// Gather the price of the item, multiplied by quantity.
				var price = (result.rows[0].price).replace(/[^\d.-]/g, '');
				var totalCost = price * quan;
				cartCost += totalCost;
			}
		});
	}
	res.redirect('indexTEST');
});

router.get('/removeFromCartTEST', function(req, res, next) {
	var removeQuantity = 0;
	for (i = 0; i < cart.length; i++){
		if (cart[i].id==req.query.item){	// Found item
			removeQuantity = (+cart[i].quantity) - (+req.query.quantity);
			if (removeQuantity < 0){ removeQuantity = +cart[i].quantity; }
			var price = (cart[i].item[0].price).replace(/[^\d.-]/g, '');
			var totalCost = +price * +removeQuantity;
			cartCost = +cartCost - +totalCost;
			// Still need to ... remove quan from cart
			cart[i].quantity = (+cart[i].quantity) - (+removeQuantity);
		}
	}
	res.redirect('cartTEST');
});

router.get('/paymentTEST', function(req, res, next) {
	// ... show page requesting payment information (credit card & address)
	res.redirect('indexTEST');
});

router.get('/purchaseTEST', function(req, res, next) {
	// ... Remove purchased items from database
	res.redirect('indexTEST');
});
/** End of testing pages */

>>>>>>> origin/master
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

<<<<<<< HEAD
router.get('/browse', function(req, res, next) {
  res.render('browse', {title: 'Browse', resultPlace: {}});
});

router.get('/browse/:catagory', function(req, res, next) {
	var header = 'Browse in ' + req.params.catagory;
	res.render('browse', {title: 'Browse'});
});

router.get('/browse-location/:location', function(req, res, next) {
	var header = 'Browse in ' + req.params.location;
	res.render('browse', {title: 'Browse'});
});;
=======
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
>>>>>>> origin/master

module.exports = router;
