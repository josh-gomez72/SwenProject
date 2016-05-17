var express = require('express');
var router = express.Router();

var pg = require('pg'); //used for windows

var database = "postgres://tihxgzxemzbafr:hiCzGMi1vENgac3Cmd-UyZDeZ-@ec2-54-235-208-3.compute-1.amazonaws.com:5432/defa0fcjs2b02k?ssl=true";
var client = new pg.Client(database);
client.connect();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('buy', { title: 'Farmers Market' });
});

router.post('/item', function(req,res,next){
  console.log(JSON.stringify(req.body));

  client.query("SELECT * FROM Items WHERE itemid="+req.body.itemID+";", function(error, result){
    if (error){
      console.error('Failed to execute query');
      console.error(error);
      return;
    }
    console.log("RESULT: " + JSON.stringify(result.rows[0]));
    res.write(JSON.stringify(result.rows[0]));
    res.end();
  });
});

router.post('/addToCart', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  res.write("<strong>Success!</strong> Item added to cart.");
  res.end();
});

module.exports = router;