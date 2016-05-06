var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); //supports JSON-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req,res){
  res.send('Hello World!');
});

app.listen(port, function(){
  console.log('Listening on port 8080!');
});
