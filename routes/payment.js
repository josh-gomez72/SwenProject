var express = require('express');
var router = express.Router();
var client = require('../lib/db.js');
var email = require('../lib/email.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('payment', {title: 'Cart', totalCost: global.cost});
});

router.post('/process', function(req, res, next){
	console.log(req.body);
	console.log(global.cost);
	var query = "SELECT * FROM Cart, Items WHERE Cart.userid=" + global.userID + " AND Items.itemid=Cart.itemid;";
	client.query(query, function(error, result){
		if (error){
			console.error('Failed to execute query');
			console.error(error);
			return;
		}
		var cart = result.rows;

		email.sendMailProcessCart(req.body, cart);
		
	});
	/* Code for removing from cart database */
	/* Kirsty's Code */
	/* ... */
	res.redirect('/browse');
});

module.exports = router;
