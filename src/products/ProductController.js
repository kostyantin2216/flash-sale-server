var express = require('express');
var ProductStore = require('./services/ProductStore');
var resultHandler = require('../utilities/server-utilities').jsonResultHandler;

var router = express.Router();

// Get all products 
router.get('/', function(req, res) {
    var handler = resultHandler.bind(res);
    ProductStore.getSummarizedProducts(handler);
});

// Get product with provided id
router.get('/:brand/:name', function(req, res) {
    var handler = resultHandler.bind(res);
    ProductStore.getProductDetails(req.params.brand, req.params.name, handler);
});

module.exports = router;
