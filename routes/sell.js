var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');

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
  res.write("Hey");
  res.end();
});

module.exports = router;