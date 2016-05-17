var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

var pg = require('pg'); //used for windows

var database = "postgres://tihxgzxemzbafr:hiCzGMi1vENgac3Cmd-UyZDeZ-@ec2-54-235-208-3.compute-1.amazonaws.com:5432/defa0fcjs2b02k?ssl=true";
var client = new pg.Client(database);
client.connect();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('sell', { title: 'Farmers Market' });
});

var upload = multer({dest: './uploads/'});
router.post('/uploadPhoto', upload.single('fileToUpload'), function(req, res) {
  console.log("file: " + JSON.stringify(req.file));
  fs.createReadStream(req.file.path).pipe(fs.createWriteStream('../public/images/uploads/'+req.file.filename+".png"));
  fs.unlink(req.file.path, function(err) {
    if (err) {
      return console.error(err);
    }
    console.log("File deleted successfully!");
  });
  res.write("/images/uploads/"+req.file.filename+".png");
  
  res.end();
});

router.post('/list', function(req,res){
  console.log("LIST: "+req.body.title);
  console.log("LIST: "+req.body.desc);
  console.log("LIST: "+req.body.price);
  console.log("LIST: "+req.body.images);

  var input = "VALUES('"+req.body.title+"','"+
      req.body.desc+"'," +
      "'misc','" +
      req.body.price+"','" +
      JSON.stringify(req.body.images)+"','" +
      10+"'," +
      "'SmithBob'," +
      "'ULTRA MISC'" +
      ");"
  console.log("INPUT: " + input);
  res.write("Hey");
  // VALUES("+req.body.title+","+req.body.desc+",human,"+req.body.price+","+req.body.images+",10,Jesus,God)
  client.query("INSERT INTO Items(name,description,category,price,image,stock,seller,parent_category)" +
      input, function(error, result){
    // done();
    if (error){
      console.error('Failed to execute query');
      console.error(error);
      return;
    }
    console.log("RESULT: " + JSON.stringify(result.rows));
  });


  res.end();
});

module.exports = router;