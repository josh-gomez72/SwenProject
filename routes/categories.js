var express = require('express');
var router = express.Router();


var categories = [{parent:"Bakery", children:["Bread","Biscuits","Cakes","Pastries","Wraps","Other"]}];
categories.push({parent:"Dairy and Eggs", children:["Butter","Cheese","Eggs","Milk","Yogurt","Dairy Alternatives","Other"]});
categories.push({parent:"Fruit", children:["Apples and Pears","Berries","Citrus","Stone Fruit","Tropical Fruit","Organic Fruit","Other"]});
categories.push({parent:"Vegetables", children:["Beans and Peas","Chillies and Peppers","Cucumber and Zucchini","Leafy Vegetables","Pumpkin and Squash","Root Vegetables","Tomatoes","Organic Vegetables","Other"]});
categories.push({parent:"Other", children:["Antipasto","Drinks","Condiments","Oils and Vinegars","Sauces","Spreads","Sweets and Snacks","Other"]});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.end(JSON.stringify(categories));
});

module.exports = router;