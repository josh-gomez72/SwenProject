var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  });

router.get('/users', function(req, res, next) {
 // res.send('respond with a resource');
  res.render('sell', { title: 'The Market - Create Listing' });
});

module.exports = router;
