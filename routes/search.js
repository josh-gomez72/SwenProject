var express = require('express');
var router = express.Router();
var client = require('../lib/db.js');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render("search", {title: 'The Market - Search'});
});

router.post('/', function(req, res, next) {

    console.log("CATEGORY: " + req.body.category);
    console.log("PARENT CATEGORY: " + req.body.parentCategory);
    console.log("SEARCHSTRING: " + req.body.searchString);

    var query = "SELECT * FROM Items";
    if (req.body.category != '' || req.body.parentCategory != '' || req.body.searchString != '') query += " WHERE ";
    if (req.body.category != '') query += "Items.category='"+req.body.category+"'";
    if (req.body.category != '' && req.body.parentCategory != '') query += " AND ";
    if (req.body.parentCategory != '') query += "Items.parent_category='"+req.body.parentCategory+"'";

    if (req.body.searchString != ''){
        if (req.body.category != '' || req.body.parentCategory != '') query += " AND ";
        else query += "(UPPER(category) LIKE UPPER('%"+req.body.searchString+"%') OR UPPER(parent_category) LIKE UPPER('%"+req.body.searchString+"%')) OR ";
        query += "(UPPER(description) LIKE UPPER('%"+req.body.searchString+"%') OR UPPER(name) LIKE UPPER('%"+req.body.searchString+"%'))";
    }


    query += ";";

    console.log("QUERY: " + query);
    client.query(query, function (error, result) {
        if (error) {
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("RESULT: " + JSON.stringify(result.rows));
        res.end(JSON.stringify(result.rows));
    });
});

module.exports = router;