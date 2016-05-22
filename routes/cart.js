var express = require('express');
var router = express.Router();
var client = require('../lib/db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	var query = "SELECT * FROM Cart, Items WHERE Cart.userid=" + global.userID + " AND Items.itemid=Cart.itemid;";
	client.query(query, function(error, result){
		if (error){
			console.error('Failed to execute query');
			console.error(error);
			return;
		}
		//console.log(JSON.stringify(result.rows));
		var cart = result.rows;
		var cost = +0;
		/* Calculate price */
		for (i=0; i < cart.length; i++){
			console.log(cart[i].price + " .. " + cart[i].quantity);
			cost += +(cart[i].price).replace(/[^\d.-]/g, '') * +cart[i].quantity;
		}
		global.cost = cost;
        
		res.render('cart', {title: 'The Market - Cart', cart: cart, cost: cost});
		
  });
});

router.get('/buildTable', function(req, res, next) {
    res.redirect('/cart');
    var query = "CREATE TABLE WishList(";
    query += "id serial primary key,";
    query+= "username varchar(255) references Users(username),";
    query+= "itemid int";
    // query+= "quantity int";
    query+= ");";

    console.log("QUERY: " + query);
    client.query(query, function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("BUILT TABLE: Cart");
    });
});

router.get('/addRandom', function(req, res, next) {
    var query = "INSERT INTO Cart(userid,itemid,quantity) ";
    query += "VALUES ('1','24','4')";

    console.log("QUERY: " + query);
    client.query(query, function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("ADDED TO TABLE: Cart");
        res.redirect('/cart');
    });
});

router.post('/addItem', function(req, res, next) {
	var itemid = req.body.output.itemid;	// ID of item to add to cart
	var quantity = +req.body.quantity;	// Quantity to ADD to the cart
	
	// First, check cart to see if the item already exists.
	var query = "SELECT * FROM Cart WHERE userid=" + global.userID + " AND itemid=" + itemid +";";
	client.query(query, function(error, result){
		if (error){
			console.error('Failed to execute query');
			console.error(error);
			return;
		}
		if (result.rows.length > 0){	// This item exists within the cart.
			quantity += +result.rows[0].quantity;	// Increment existing quantity
			var increment = "UPDATE Cart SET quantity = '" + quantity + "' WHERE itemid = '" + itemid + "' AND userid='" + global.userID + "'";
			client.query(increment, function(error, result){
				if (error){ console.error(error); }
			});
		} else {
			// The item does not exist. Must ADD it to the table.
			var insert = "INSERT INTO Cart(userid,itemid,quantity) VALUES ('" + global.userID + "', '" + itemid + "', '" + quantity + "')";
			console.log("QUERY: " + insert);
			client.query(insert, function(error, result){
				if (error){
					console.error(error);
				}
				console.log("An item has been added to the cart");
			});
		}
	});
});

router.get('/removeItem', function(req, res, next) {
	var itemid = req.query.itemid;
	//Find existing item in db and cart
	var query = "SELECT * FROM Cart, Items WHERE Cart.userid=" + global.userID + " AND Items.itemid=Cart.itemid AND Cart.itemid='"+ itemid +"';";
	client.query(query, function(error, result){
        if (error){ console.error('Failed to execute query');}
		var inventory = result.rows;
		// Add cart quantity to item quantity.
		var update = "UPDATE Items SET stock = '" + (+inventory[0].quantity + +inventory[0].stock) + "' WHERE itemid = '" + itemid + "';";
		console.log(update);
			client.query(update, function(error, result){
				if (error){ console.error(error); }
			});
    });
	// add quantity from cart back into database
	
	// remove item from cart
    var query = "DELETE FROM Cart WHERE itemid = " + itemid + " AND userid = " + global.userID + " ";
    console.log("QUERY: " + query);
    client.query(query, function(error, result){
        if (error){ console.error('Failed to execute query');}
		res.redirect('/cart');
    });
});

router.post('/items', function(req,res,next){
  var query = "SELECT * FROM Cart, Items WHERE Cart.userid="+req.body.userID+" AND Items.itemid=Cart.itemid;";
  client.query(query, function(error, result){
    if (error){
      console.error('Failed to execute query');
      console.error(error);
      return;
    }
    //console.log("ALL ITEMS IN TABLE Cart: " + JSON.stringify(result.rows));

    res.write(JSON.stringify(result.rows));
    res.end();
  });
});

router.get('/dropTable', function(req, res, next) {

    var query = "DROP TABLE WishList";

    console.log("QUERY: " + query);
    client.query(query, function(error, result){
        if (error){
            console.error('Failed to execute query');
            console.error(error);
            return;
        }
        console.log("DROPPED TABLE: Cart");
        res.redirect('/cart');
    });
});

module.exports = router;