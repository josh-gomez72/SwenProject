var express = require('express');
var router = express.Router();
var client = require('../lib/db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("TESTING CART JS FILE: USERID = " + userID);
	// Need to get the correct userID
	var query = "SELECT * FROM Cart, Items WHERE Cart.userid=1 AND Items.itemid=Cart.itemid;";
	client.query(query, function(error, result){
		if (error){
			console.error('Failed to execute query');
			console.error(error);
			return;
		}
		var cart = result.rows;
		res.render('cartTEST', {title: 'The Market', cart: cart});
  });
});

router.get('/buildTable', function(req, res, next) {
    res.redirect('/cart');
    var query = "CREATE TABLE WishList(";
    query += "id serial primary key,";
    query+= "username varchar(255) references Users(username),";
    query+= "itemid int";
    // query+= "quantity int";
    query+= ");";

    console.log("QUERY: " + query);
    client.query(query, function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("BUILT TABLE: Cart");
    });
});

router.get('/addRandom', function(req, res, next) {
    var query = "INSERT INTO Cart(userid,itemid,quantity) ";
    query += "VALUES ('1','24','4')";

    console.log("QUERY: " + query);
    client.query(query, function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("ADDED TO TABLE: Cart");
        res.redirect('/cart');
    });
});

router.get('/addItem', function(req, res, next) {
    var query = "INSERT INTO Cart(userid,itemid,quantity) ";
    query += "VALUES ('1','24','4')";

    console.log("QUERY: " + query);
    client.query(query, function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("ADDED TO TABLE: Cart");
        res.redirect('/cart');
    });
});

router.post('/items', function(req,res,next){
  var query = "SELECT * FROM Cart, Items WHERE Cart.userid="+req.body.userID+" AND Items.itemid=Cart.itemid;";
  client.query(query, function(error, result){
    if (error){
      console.error('Failed to execute query');
      console.error(error);
      return;
    }
    //console.log("ALL ITEMS IN TABLE Cart: " + JSON.stringify(result.rows));

    res.write(JSON.stringify(result.rows));
    res.end();
  });
});

router.get('/dropTable', function(req, res, next) {

    var query = "DROP TABLE WishList";

    console.log("QUERY: " + query);
    client.query(query, function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("DROPPED TABLE: Cart");
        res.redirect('/cart');
    });
});

module.exports = router;