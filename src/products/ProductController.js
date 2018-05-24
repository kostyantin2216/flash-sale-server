"use strict";

const express = require('express');

const resultHandler = require('../utilities/server-utilities').jsonResultHandler;
const ProductStore = require('./services/ProductStore');
const ProductProcessor = require('./services/ProductProcessor');

const router = express.Router();

// Get all products 
router.get('/', function(req, res) {
    var handler = resultHandler.bind(res);
    ProductStore.getSummarizedProducts(ProductProcessor.summarizeMany).then(
        results => handler(null, results),
        handler
    );
});

// Get product with provided brand and name
router.get('/:brand/:name', function(req, res) {
    var handler = resultHandler.bind(res);
    ProductStore.getProductDetails(req.params.brand, req.params.name, ProductProcessor.detailed).then(
        result => handler(null, result),
        handler
    );
});

module.exports = router;
