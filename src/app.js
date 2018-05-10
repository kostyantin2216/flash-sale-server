var AWS = require("aws-sdk");
var express = require('express');

AWS.config.update({
    region: "eu-west-2"
});

var app = express();

var ProductController = require('./products/ProductController');
app.use('/products', ProductController);

module.exports = app;