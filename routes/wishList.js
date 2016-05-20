var express = require('express');
var router = express.Router();
var client = require('../lib/db.js');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('wishlist');
});

router.post('/remove', function(req, res, next) {
    client.query("DELETE FROM WishList WHERE id="+req.body.id+";", function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("REMOVED ITEMID: " + req.body.itemid);
        res.write(JSON.stringify({success:true,message:"<strong>Success!</strong> "+req.body.name+" removed!"}));
        res.end();
    });
});

router.post('/items', function(req,res,next){
    console.log(JSON.stringify(req.body));

    client.query("SELECT * FROM WishList, Items WHERE WishList.username='"+req.body.username+"'  AND Items.itemid=WishList.itemid;", function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("RESULT: " + JSON.stringify(result.rows));
        
        res.write(JSON.stringify(result.rows));
        res.end();
    });
});

router.post('/add', function(req, res, next) {
    var query = "INSERT INTO WishList(username,itemid) ";
    query += "VALUES ('"+req.body.username+"','"+req.body.itemID+"')";

    console.log("QUERY: " + query);
    client.query(query, function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("ADDED TO TABLE: WishList: " + req.body.username + ", " + req.body.itemID);
        res.write(JSON.stringify({success:true, message:"<strong>Item added to wishlist!</strong>"}));
        res.end();
    });
});

module.exports = router;