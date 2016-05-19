var express = require('express');
var router = express.Router();

var pg = require('pg'); //used for windows

var database = "postgres://tihxgzxemzbafr:hiCzGMi1vENgac3Cmd-UyZDeZ-@ec2-54-235-208-3.compute-1.amazonaws.com:5432/defa0fcjs2b02k?ssl=true";
var client = new pg.Client(database);
client.connect();


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

    client.query("SELECT * FROM WishList, Items WHERE WishList.userid="+req.body.userID+"  AND Items.itemid=WishList.itemid;", function(error, result){
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
    var query = "INSERT INTO WishList(userid,itemid) ";
    query += "VALUES ('1','"+req.body.itemID+"')";

    console.log("QUERY: " + query);
    client.query(query, function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("ADDED TO TABLE: WishList: " + 1 + ", " + req.body.itemID);
        res.write(JSON.stringify({success:true, message:"<strong>Item added to wishlist!</strong>"}));
        res.end();
    });
});

module.exports = router;