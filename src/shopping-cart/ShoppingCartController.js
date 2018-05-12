"use strict";

const express = require('express');

const resultHandler = require('../utilities/server-utilities').jsonResultHandler;
const SCManager = require('./services/ShoppingCartManager');
const SCTokenManager = require('./services/ShoppingCartTokenManager');
const SCResponseFactory = require('./services/ShoppingCartResponseFactory');

const router = express.Router();


router.get('/:token', stub('/:token'));

router.get('/:token/valid', stub('/:token/valid'));


router.post('/add', function(req, res) {
    const handler = resultHandler.bind(res);

    const product = req.body.product;
    if(product && product.name && product.brand) {
        let token = req.body.token;
        SCManager.cartExists(token).then(
            cartExists => {
                if(cartExists) {
                    addToCart(token, product);
                } else {
                    SCManager.createCart().then(
                        newToken => addToCart(newToken, product), 
                        handler
                    );
                }
            },
            handler
        );
    } else {
        handler(new Error("Missing product name and/or brand"));
    }
});

function addToCart(handler, token, product) {
    SCManager.addToCart(token, product.name, product.brand).then(
        products => {
            SCResponseFactory.createResponse(token).then(
                response => {
                    response.products = products;
                    handler(null, response);
                },
                handler
            );
        },
        handler
    );
}

router.post('/validateToken', function(req, res) {
    const handler = resultHandler.bind(res);

    const token = req.body.token;

    SCTokenManager.isValid(token).then(
        isValid => {
            if(isValid) {
                SCTokenManager.updateToken();
                SCResponseFactory.createResponse(token).then(
                    response => handler(null, response),
                    handler
                );
            } else {
                handler(new Error(`Invalid token`));
            }
        },
        handler
    );
});


router.delete('/remove', function(req, res) {
    const handler = resultHandler.bind(res);

    const product = req.body.product;
    if(product && product.name && product.brand) { 
        const token = req.body.token;
        SCManager.cartExists(req.body.token).then(
            cartExists => {
                if(cartExists) {
                    SCManager.removeFromCart(token, product.name, product.brand).then(
                        products => {
                            if(products === null) {
                                handler(null, { products: [] });
                            } else {
                                SCResponseFactory.createResponse(token).then(
                                    response => {
                                        response.products = products;
                                        handler(null, response);
                                    },
                                    handler
                                )
                            }
                        },
                        handler
                    );
                }
            },
            handler
        );
    } else {
        handler(new Error("Missing product name and/or brand"));
    }
});


module.exports = router;

function stub(path) {
    return function(req, res) {
        let token = SCTokenManager.createToken().then((token) => {    
            console.log(path.replace(':token', req.params.token), '-', JSON.stringify(req.body));
            console.log('token:', token);
            res.json(req.body);
        });
    }
}
