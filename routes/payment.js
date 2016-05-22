var express = require('express');
var router = express.Router();
var client = require('../lib/db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	/* Need to retrieve data for autofill? */
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
		//console.log(JSON.stringify(result.rows));
		var cart = result.rows;
	});
	/* Code for removing from cart database */
	var deleteCart = "DELETE FROM Cart WHERE userid=" + global.userID + ";";
	console.log(deleteCart);
	client.query(deleteCart, function(error, result){
		if (error){
			console.error('Failed to execute query');
			console.error(error);
			return;
		}
	});
	/* ... */
	res.redirect('/browse');
});

module.exports = router;
