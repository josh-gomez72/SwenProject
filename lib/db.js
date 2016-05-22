/**
 * Created by Josh on 20/05/2016.
 */
var pg = require('pg'); //used for windows machines
//var pg = require('pg').native; //used for linux machines

var database = "postgres://tihxgzxemzbafr:hiCzGMi1vENgac3Cmd-UyZDeZ-@ec2-54-235-208-3.compute-1.amazonaws.com:5432/defa0fcjs2b02k?ssl=true";
var client = new pg.Client(database);
client.connect();

pg.connect(database, function(err, client, done){
    if(err){
        console.error('Could not connect to the database');
        console.error(err);
        return;
    }

    console.log('Connected to database: SwenGroup9');
    // client.query("SELECT * FROM Users;", function(error, result){
    //     done();
    //     if (error){
    //         console.error('Failed to execute query');
    //         console.error(error);
    //         return;
    //     }
    //     console.log(result);
    // });
});


module.exports = client;