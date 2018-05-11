"use strict";

const express = require('express');

const resultHandler = require('../utilities/server-utilities').jsonResultHandler;
const ProductStore = require('./services/ProductStore');
const ProductProcessor = require('./services/ProductProcessor');

const router = express.Router();

// Get all products 
router.get('/', function(req, res) {
    var handler = resultHandler.bind(res);
    ProductStore.getSummarizedProducts().then(
        results => {
            ProductProcessor.summarizeMany(results).then(
                data => handler(null, data),
                handler
            );
        },
        handler
    );
});

// Get product with provided brand and name
router.get('/:brand/:name', function(req, res) {
    var handler = resultHandler.bind(res);
    ProductStore.getProductDetails(req.params.brand, req.params.name).then(
        result => {
            ProductProcessor.detailed(result).then(
                data => handler(null, data),
                handler
            );
        },
        handler
    );
});

module.exports = router;
