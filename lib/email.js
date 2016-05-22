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
    }
}