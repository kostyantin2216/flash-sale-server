"use strict";

const AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-west-2"
});


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ProductController = require('./products/ProductController');
const ShoppingCartController = require('./shopping-cart/ShoppingCartController');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/products', ProductController);
app.use('/cart', ShoppingCartController);

module.exports = app;