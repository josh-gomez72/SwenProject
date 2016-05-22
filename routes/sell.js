var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var client = require('../lib/db.js');
var email = require('../lib/email.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('sell', { title: 'The Market - Create Listing' });
});

var upload = multer({dest: './uploads/'});
router.post('/uploadPhoto', upload.single('fileToUpload'), function(req, res) {
    console.log("file: " + JSON.stringify(req.file));
    var pipe = fs.createReadStream(req.file.path).pipe(fs.createWriteStream('../public/images/uploads/'+req.file.filename+".png"));
    pipe.on('finish', function () {
        res.write("/images/uploads/"+req.file.filename+".png");
        res.end();
    });
    fs.unlink(req.file.path, function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("File deleted successfully!");
    });
});

router.post('/', function(req,res){
    console.log("LIST: "+req.body.title);
    console.log("LIST: "+req.body.desc);
    console.log("LIST: "+req.body.price);
    console.log("LIST: "+req.body.images);

    var input = "VALUES('"+req.body.name+"','"+
        req.body.description+"','" +
        req.body.category+"','" +
        req.body.price+"','";
    if (req.body.image.length == 0) input += "{}','";
    else {
        input += "{";
        for (i in req.body.image) {
            input += "\"" + req.body.image[i];
            if (i != req.body.image.length - 1) input += "\",";
            else input += "\"}','";
        }
    }
    input += req.body.stock+"','";
    input += req.body.seller+"','";
    input += req.body.parent_category+"'";
    input += ");";
    console.log("INPUT: " + input);
    client.query("INSERT INTO Items(name,description,category,price,image,stock,seller,parent_category)" +
        input, function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            res.write(JSON.stringify({success:false,message:"<strong>Error: </strong> Item unable to be listed."}));
            res.end();
            return;
        }
        console.log("RESULT: " + JSON.stringify(result.rows));
        email.sendMailForListing(req.body);

        res.write(JSON.stringify({success:true,message:"<span class='glyphicon glyphicon-floppy-saved'></span> <strong>Success!</strong> Item listed."}));
        res.end();
    });



});

module.exports = router;