var express = require('express');
var router = express.Router();
//var pg = require('pg').native; //used for lab machines
var pg = require('pg'); //used for windows

//var database = "postgres://gomezjosh:password@depot:5432/SwenGroup9";
var database = "postgres://tihxgzxemzbafr:hiCzGMi1vENgac3Cmd-UyZDeZ-@ec2-54-235-208-3.compute-1.amazonaws.com:5432/defa0fcjs2b02k?ssl=true";
var client = new pg.Client(database);
client.connect();

router.get('/', function(req, res, next) {
	res.redirect('/browse');
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

module.exports = router;
