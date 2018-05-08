var express = require('express');
var ProductStore = require('./services/ProductStore');
var resultHandler = require('../utilities/server-utilities').jsonResultHandler;

var router = express.Router();

// Get all products 
router.get('/', function(req, res) {
    var handler = resultHandler.bind(res);
    ProductStore.getSummarizedProducts(null, handler);
});

// Get products in category
router.get('/:category', function(req, res) {
    var handler = resultHandler.bind(res);
    ProductStore.getSummarizedProducts(req.params.category, handler);
});

// Get product with provided id
router.get('/:category/:name', function(req, res) {
    var handler = resultHandler.bind(res);
    ProductStore.getProductDetails(req.params.name, req.params.category, handler);
});

module.exports = router;
