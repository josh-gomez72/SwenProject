var express = require('express');
var router = express.Router();

var pg = require('pg'); //used for windows
// var pg = require('pg').native; // used for linux

var database = "postgres://tihxgzxemzbafr:hiCzGMi1vENgac3Cmd-UyZDeZ-@ec2-54-235-208-3.compute-1.amazonaws.com:5432/defa0fcjs2b02k?ssl=true";
var client = new pg.Client(database);
client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('myListings');
});
router.get('/edit', function(req, res, next) {
  res.render('edit');
});

router.post('/edit', function(req, res, next) {
  
  console.log("RECIEVED: " + JSON.stringify(req.body));
  var query = "SELECT * FROM Items WHERE seller='SmithBob';";
  query = "UPDATE Items SET ";
  query += "name='"+req.body.name+"',";
  query += "description='"+req.body.description+"',";
  query += "category='"+req.body.category+"',";
  query += "price='"+req.body.price+"',";

  if (req.body.image.length == 0) query += "image='{}',";
  else {
    query += "image='{";
    for (i in req.body.image) {
      query += "\"" + req.body.image[i];
      if (i != req.body.image.length - 1) query += "\",";
      else query += "\"}',";
    }
  }

  query += "stock='"+req.body.stock+"',";
  query += "seller='"+req.body.seller+"',";
  query += "parent_category='"+req.body.parent_category+"' ";
  query += "WHERE itemid='"+req.body.itemid+"';";
  console.log("QUERY: " + query);
  client.query(query, function(error, result){
    if (error){
      console.error('Failed to execute query');
      console.error(error);
      res.write(JSON.stringify({success:false, message:"<strong>Error:</strong> Failed to edit file."}));
      res.end();
      return;
    }
    console.log(JSON.stringify(result));
    res.write(JSON.stringify({success:true, message:"<span class='glyphicon glyphicon-floppy-saved'></span> <strong>File Edited Successfully!</strong>"}));
    res.end();
  });
});

router.post('/remove', function(req, res, next) {
  client.query("DELETE FROM Items WHERE itemid="+req.body.itemid+";", function(error, result){
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

router.post('/getListings', function(req,res){
  console.log("GETTING LISTINGS FOR USERNAME: "+req.body.user);

  client.query("SELECT * FROM Items WHERE seller='"+req.body.user+"';", function(error, result){
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

router.post('/itemFromID', function(req,res){
  console.log("GETTING LISTING FOR ID: "+req.body.itemID);

  client.query("SELECT * FROM Items WHERE itemid='"+req.body.itemID+"';", function(error, result){
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

module.exports = router;