var express = require('express');
var router = express.Router();

var pg = require('pg'); //used for windows

// var database = "postgres://gomezjosh:password@depot:5432/SwenGroup9";
var database = "postgres://tihxgzxemzbafr:hiCzGMi1vENgac3Cmd-UyZDeZ-@ec2-54-235-208-3.compute-1.amazonaws.com:5432/defa0fcjs2b02k?ssl=true";
var client = new pg.Client(database);
client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cart');
});

//  TODO - BUILD CART TABLE FOR REASONS
router.get('/buildTable', function(req, res, next) {
    res.redirect('/cart');
    var query = "CREATE TABLE Cart(";
    query += "id serial primary key,";
    query+= "userid int references Users(id),";
    query+= "itemid int,";
    query+= "quantity int";
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

router.post('/items', function(req,res,next){
  var query = "SELECT * FROM Cart, Items WHERE Cart.userid="+req.body.userID+" AND Items.itemid=Cart.itemid;";
  client.query(query, function(error, result){
    if (error){
      console.error('Failed to execute query');
      console.error(error);
      return;
    }
    console.log("ALL ITEM IN TABLE Cart: " + JSON.stringify(result.rows));

    res.write(JSON.stringify(result.rows));
    res.end();
  });
});

router.get('/dropTable', function(req, res, next) {
    res.redirect('/dropTable');
    var query = "DROP TABLE Cart";

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