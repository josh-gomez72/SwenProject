var express = require('express');
var router = express.Router();
var pg = require('pg');

var database = "postgres://gomezjosh:password@depot:5432/SwenGroup9";

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

module.exports = router;
