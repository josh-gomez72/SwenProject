var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('buy', { title: 'Farmers Market' });
});

router.post('/addToCart', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  res.write("<strong>Success!</strong> Item added to cart.");
  res.end();
});

module.exports = router;