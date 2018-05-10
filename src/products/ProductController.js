var express = require('express');
var ProductStore = require('./services/ProductStore');
var resultHandler = require('../utilities/server-utilities').jsonResultHandler;
var ProductProcessor = require('./services/ProductProcessor');

var router = express.Router();

// Get all products 
router.get('/', function(req, res) {
    var handler = resultHandler.bind(res);
    ProductStore.getSummarizedProducts((err, results) => {
        if(err) {
            handler(err);
        } else {
            let summarized = ProductProcessor.summarizeMany(results);
            handler(err, summarized);
            
        }
    });
});

// Get product with provided id
router.get('/:brand/:name', function(req, res) {
    var handler = resultHandler.bind(res);
    ProductStore.getProductDetails(req.params.brand, req.params.name, (err, result) => {
        if(err) {
            handler(err);
        } else {
            ProductProcessor.detailed(result).then(
                data => handler(err, data),
                newErr => handler(newErr)
            );
        }
    });
});

module.exports = router;
