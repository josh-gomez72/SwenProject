var express = require('express');
var router = express.Router();
var client = require('../lib/db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/login');
});

router.get('/logout', function(req, res, next) {
	global.userName = null;
	global.userID = -1;
	res.redirect('/login');
});

router.get('/login', function(req, res, next){
	res.render('login', {title: 'Login'});
});

router.post('/login', function (req, res, next){
	if (req.body.username){
		// Query database for user. If user exists, allow login.
		var query = client.query("SELECT * FROM Users WHERE username = '" + req.body.username + "';", function (error, result) {
			if (error){ console.log(error);}
			else {
				if (result.rows.length > 0){	// A user exists with this name, successful login.
					global.userName = result.rows[0].username;
					global.userID = result.rows[0].id;
					res.redirect('/browse');
				}
				else {	// No existing username, fail to log in.
					res.render('login', {title: 'The Market', user:global.userName, err: 'Username or password incorrect. Please try again.'});
				}
			}
		});
	} else {		// no username was passed in.
		res.render('login', {title: 'The Market'});
	}
	
});

router.get('/user', function(req, res, next) {
    console.log("CURRENT_USER: " + global.userName);
    res.end(JSON.stringify({username:global.userName}));
});

/** Testing pages */
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
/** End of testing pages */



router.get('/browse', function(req, res, next) {
  res.render('browse', {title: 'Browse', resultPlace: {}});
});

/**
router.get('/browse/:catagory', function(req, res, next) {
	var header = 'Browse in ' + req.params.catagory;
	res.render('browse', {title: 'Browse'});
});
*/

router.get('/browse-location/:location', function(req, res, next) {
	var header = 'Browse in ' + req.params.location;
	res.render('browse', {title: 'Browse'});
});

router.get('/register', function(req, res, next){
	res.render('register', {title: 'Register User'});
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

router.post('/register', function(req, res, next){
	//res.send(req);
	var fname = req.body.firstname;
	var lname = req.body.lastname;
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var address = req.body.address;
	var city = req.body.city;
	var postcode = req.body.postcode;
	var phone = req.body.phoneNumber;

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
	res.redirect('browse');
});
module.exports = router;
