var express = require('express');
var nodemailer = require('nodemailer');
var client = require('../lib/db.js');

var transporter = nodemailer.createTransport('smtps://themarketapp%40gmail.com:doggomaster666@smtp.gmail.com');

var mailOptions = {
    from: '"The Market" <themarketapp@gmail.com>', // sender address
    to: 'cullumdeighton@gmail.com', // list of receivers
    subject: '', // Subject line
    html: '<i><b>420BOOTYWIZARD</b></i>' // html body
};

module.exports = {
    sendMail: function () {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    },
    sendMailForPurchase: function (item) {
        console.log("EMAILING ABOUT: " + JSON.stringify(item));

        var message = "Congratulations, you just purchased : <b>" + item.name + "</b><br>";
        message += "<b>Details:</b><br>";

        message += "<style>table, th, td {border: 1px solid black; border-collapse: collapse;}th, td { padding: 5px;}th {text-align: left;}</style>"

        message += "<table style='width:100%'><tr><th style='text-align: left'>Price: </th><td>"+item.price+"</td></tr>";
        message += "<tr><th style='text-align: left'>Description: </th><td>"+item.description+"</td></tr>";
        message += "<tr><th style='text-align: left'>Categories: </th><td>"+item.category+", "+item.parent_category+"</td></tr>";
        message += "</table>";
        console.log("EMAILING HTML: " + message);

        mailOptions.subject = "Item Purchase: " + item.name;
        mailOptions.html = message;
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    },sendMailForListing: function (listing) {
        mailOptions.subject = "Item Listed! " + listing.name;
        var message = "Congratulations, "+ listing.seller + "! Your item <b>" + listing.name + "</b> was added successfully. <br>";
        message += "It had the following details:<br> <br>";

        message += "<style>table, th, td {border: 1px solid black; border-collapse: collapse;}th, td { padding: 5px;}th {text-align: left;}</style>"
        message += "<table style='width:100%'><tr><th style='text-align: left'>Price: </th><td>"+listing.price+"</td></tr>";
        message += "<tr><th style='text-align: left'>Quantity: </th><td>"+listing.stock+"</td></tr>";
        message += "<tr><th style='text-align: left'>Description: </th><td>"+listing.description+"</td></tr>";
        message += "<tr><th style='text-align: left'>Categories: </th><td>"+listing.category+", "+listing.parent_category+"</td></tr>";
        message += "</table>";

        var queryString = "SELECT * FROM Users WHERE username = '" + listing.seller + "';";

        client.query(queryString, function (error, result) {
                if (error){
                    console.log(error);
                    return;
                }
                console.log(result.rows);
                mailOptions.to = result.rows[0].email;
                mailOptions.html = message;
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
            }
        );
    },sendMailForRemoving: function (listing) {
        mailOptions.subject = "Item Removed: " + listing.name;
        var message = "Hello, "+ listing.seller + "! Your item <b>" + listing.name + "</b> was removed successfully. <br>";
        message += "It had the following details:<br> <br>";

        message += "<style>table, th, td {border: 1px solid black; border-collapse: collapse;}th, td { padding: 5px;}th {text-align: left;}</style>"
        message += "<table style='width:100%'><tr><th style='text-align: left'>Price: </th><td>"+listing.price+"</td></tr>";
        message += "<tr><th style='text-align: left'>Quantity: </th><td>"+listing.stock+"</td></tr>";
        message += "<tr><th style='text-align: left'>Description: </th><td>"+listing.description+"</td></tr>";
        message += "<tr><th style='text-align: left'>Categories: </th><td>"+listing.category+", "+listing.parent_category+"</td></tr>";
        message += "</table>";

        var queryString = "SELECT * FROM Users WHERE username = '" + listing.seller + "';";

        client.query(queryString, function (error, result) {
                if (error){
                    console.log(error);
                    return;
                }
                console.log(result.rows);
                mailOptions.to = result.rows[0].email;
                mailOptions.html = message;
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
            }
        );
    }, sendMailProcessCart: function(userInfo, cart){
        console.log("USER INFO: " + JSON.stringify(userInfo));
        console.log("CART: " + JSON.stringify(cart));

        getEmailByUsername(cart, userInfo, 0);
    }

}

function getEmailByUsername(cart, userInfo, index){
    if (index == cart.length) {
        console.log("EMAIL: " + JSON.stringify(userInfo.recipientEmail));

        if (cart.length == 1)mailOptions.subject = "Item purchased: " + cart[0].name;
        else mailOptions.subject = "Item purchases";

        var message = "Hello, "+ userInfo.recipientName + "! Your items were purchased successfully. <br>";
        message += "The items were as follows:<br> <br>";

        message += "<style>table, th, td {border: 1px solid black; border-collapse: collapse;}th, td { padding: 5px;}th {text-align: left;}</style>"
        for (i in cart) {
            message += "<b>"+cart[i].name+"</b><br>";
            // message += "<style>table, th, td {border: 1px solid black; border-collapse: collapse;}th, td { padding: 5px;}th {text-align: left;}</style>";
            message += "<table style='width:100%'><tr><th style='text-align: left'>Price: </th><td>" + cart[i].price + "</td></tr>";
            message += "<tr><th style='text-align: left'>Quantity: </th><td>" + cart[i].quantity + "</td></tr>";
            message += "<tr><th style='text-align: left'>Total Price: </th><td>$" + (cart[i].quantity * cart[i].price.replace("$", "")).toFixed(2) + "</td></tr>";
            message += "<tr><th style='text-align: left'>Description: </th><td>" + cart[i].description + "</td></tr>";
            message += "<tr><th style='text-align: left'>Categories: </th><td>" + cart[i].category + ", " + cart[i].parent_category + "</td></tr>";
            message += "</table><br><br>";
        }
        mailOptions.to = userInfo.recipientEmail;
        mailOptions.html = message;
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
        return;
    }
    var query = "SELECT * FROM Users WHERE Users.username='"+cart[index].seller+"';";
    client.query(query, function(error, result){
        console.log("EMAIL: " + JSON.stringify(result.rows[0].email));

        mailOptions.subject = "Item Sold: " + cart[index].name;

        var message = "Hello, "+ cart[index].seller + "! Your item <b>" + cart[index].name + "</b> was sold to "+userInfo.recipientName+". <br>";
        message += "It had the following details:<br> <br>";

        message += "<style>table, th, td {border: 1px solid black; border-collapse: collapse;}th, td { padding: 5px;}th {text-align: left;}</style>"
        message += "<table style='width:100%'><tr><th style='text-align: left'>Price: </th><td>"+cart[index].price+"</td></tr>";
        message += "<tr><th style='text-align: left'>Quantity: </th><td>"+cart[index].quantity+"</td></tr>";
        message += "<tr><th style='text-align: left'>Total Price: </th><td>$"+(cart[index].quantity*cart[index].price.replace("$","")).toFixed(2)+"</td></tr>";
        message += "<tr><th style='text-align: left'>Description: </th><td>"+cart[index].description+"</td></tr>";
        message += "<tr><th style='text-align: left'>Categories: </th><td>"+cart[index].category+", "+cart[index].parent_category+"</td></tr>";
        message += "</table> <br><br>";

        message += "Please send the item to <b>" + userInfo.recipientName + "</b> of the following details: <br> <br>";

        // message += "<style>table, th, td {border: 1px solid black; border-collapse: collapse;}th, td { padding: 5px;}th {text-align: left;}</style>"
        message += "<table style='width:100%'><tr><th style='text-align: left'>Address: </th><td>"+userInfo.address+"</td></tr>";
        message += "<tr><th style='text-align: left'>City: </th><td>"+userInfo.city+"</td></tr>";
        message += "<tr><th style='text-align: left'>Postcode: </th><td>"+userInfo.postcode+"</td></tr>";
        message += "<tr><th style='text-align: left'>Phone: </th><td>"+userInfo.phone+"</td></tr>";
        message += "<tr><th style='text-align: left'>Email: </th><td>"+userInfo.recipientEmail+"</td></tr>";
        message += "</table> <br><br>";

        message += "By: " + userInfo.delivDate;

        mailOptions.to = result.rows[0].email;
        mailOptions.html = message;
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
            getEmailByUsername(cart, userInfo, ++index);
        });


    });
}
