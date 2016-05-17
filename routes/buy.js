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
    // done();
    if (error){
      console.error('Failed to execute query');
      console.error(error);
      return;
    }
    console.log("RESULT: " + JSON.stringify(result.rows[0]));
    console.log("RESULT: " + JSON.parse(result.rows[0].image)[0]);
    res.write(JSON.stringify(result.rows[0]));
    res.end();
  });

  // res.write(JSON.stringify({title:"ECS", desc: "A great deal of disappointment",price: 77, images:["/images/uploads/19574e1c2d3aea60ae72a43a6e016491.png","/images/uploads/1c8f360e53886b6e6f0352ea3d38a156.png"]}));
  // res.end();
});

router.post('/addToCart', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  res.write("<strong>Success!</strong> Item added to cart.");
  res.end();
});

module.exports = router;