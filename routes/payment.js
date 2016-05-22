var express = require('express');
var router = express.Router();
var client = require('../lib/db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('payment', {title: 'Cart', totalCost: global.cost});
});

router.post('/process', function(req, res, next){
	console.log(req.body);
	/* Code for removing from cart database */
	/* ... */
	res.redirect('/browse');
});

module.exports = router;
