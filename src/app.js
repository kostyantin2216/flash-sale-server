var AWS = require("aws-sdk");
var express = require('express');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var app = express();

var ProductController = require('./products/ProductController');
app.use('/products', ProductController);

module.exports = app;