"use strict";

const express = require('express');

const resultHandler = require('../utilities/server-utilities').jsonResultHandler;
const SCManager = require('./services/ShoppingCartManager');
const SCTokenManager = require('./services/ShoppingCartTokenManager');
const SCResponseFactory = require('./services/ShoppingCartResponseFactory');

const router = express.Router();


router.get('/:token', function(req, res) {
    const handler = resultHandler.bind(res);

    const token = req.params.token;
    if (token) {
        SCManager.cartExists(token).then(
            cartExists => {
                if (cartExists) {
                    SCManager.getProducts(token).then(
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
                    )
                } else {
                    handler(new Error('Token does not exist.'));
                }
            },
            handler
        );
    } else {
        handler(new Error('Invalid token.'));
    }
});

router.post('/add', function(req, res) {
    const handler = resultHandler.bind(res);

    console.log('adding product');

    const product = req.body.product;
    if(product && product.name && product.brand) {
        let token = req.body.token;
        
        console.log('checking if cart exists');

        SCManager.cartExists(token).then(
            cartExists => {
                if(cartExists) {
                    
                    console.log('cart exists');

                    addToCart(handler, token, product);
                } else {
                    console.log("cart doesn't exist");

                    SCManager.createCart().then(
                        newToken => addToCart(handler, newToken, product), 
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
    console.log("adding to cart");

    SCManager.addToCart(token, product.name, product.brand, product.variants).then(
        products => {
            console.log('added to cart:', 'token:', token);
            
            SCResponseFactory.createResponse(token).then(
                response => {
                    console.log('added to cart:', 'token:', token);
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
