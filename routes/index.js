var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/browse/:catagory', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET search page. */
router.get('/search', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
