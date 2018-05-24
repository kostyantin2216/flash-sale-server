"use strict";

const Promise = require('promise');
const SCTokenManager = require('./ShoppingCartTokenManager');
const ShoppingCart = require('../model/ShoppingCart');
const ProductStore = require('../../products/services/ProductStore');
const ProductProcessor = require('../../products/services/ProductProcessor');

const ShoppingCartManager = (function() {
    const shoppingCarts = {};

    return {
        cartExists: function(token) {
            return Promise.resolve(token && shoppingCarts[token] !== undefined);
        },
        createCart: function() {
            return new Promise((resolve, reject) => {
                SCTokenManager.createToken(onTokenExpired).then(
                    token => {
                        let cart = new ShoppingCart(token);
                        shoppingCarts[token] = cart;
                        resolve(token);
                    },
                    reject
                ); 
            });
        },
        addToCart: function(token, productName, productBrand, chosenVariants) {
            return new Promise((resolve, reject) => {
                if(shoppingCarts[token]) {
                    SCTokenManager.updateToken(token);
                    ProductStore.getSummarizedProduct(productBrand, productName, ProductProcessor.summarize).then(
                        product => {
                            if(product) {
                                console.log(JSON.stringify(chosenVariants));
                                product.variants = chosenVariants;
                                shoppingCarts[token].products.push(product);
                                resolve(shoppingCarts[token].products);
                            } else {
                                reject(new Error('No product exists for name and brand'));
                            }
                        },
                        reject
                    );
                } else {
                    reject(new Error('No cart exists for token'));
                }
            });
        },
        removeFromCart: function(token, productName, productBrand) {
            return new Promise((resolve, reject) => {
                if(shoppingCarts[token]) {
                    SCTokenManager.updateToken(token);
                    ProductStore.getSummarizedProduct(productBrand, productName).then(
                        product => {
                            if(product) {
                                let productIndex = shoppingCarts[token].products.findIndex(p => p.name === productName && p.brand === productBrand);
                                if(productIndex >= 0) { 
                                    shoppingCarts[token].products.splice(productIndex, 1);
                                    if(shoppingCarts[token].products.length) {
                                        resolve(shoppingCarts[token].products);
                                    } else {
                                        this.deleteCart(token);
                                        resolve(null);
                                    }
                                } else {
                                    reject(new Error("This product isn't in the cart"));
                                }
                            } else {
                                reject(new Error('No product exists for name and brand'));
                            }
                        },
                        reject
                    );
                } else {
                    reject(new Error('No cart exists for token'));
                }
            });
        },
        getProducts: function(token) {
            return new Promise((resolve, reject) => {
                if(shoppingCarts[token]) {
                    SCTokenManager.updateToken(token);
                    resolve(shoppingCarts[token].products);
                } else {
                    reject(new Error('No cart exists for token'));
                }
            });
        },
        deleteCart: function(token) {
            if(shoppingCarts[token]) {
                SCTokenManager.deleteToken(token);
                delete shoppingCarts[token];
            }
        }
    }
})();

function onTokenExpired() {
    ShoppingCartManager.deleteCart(this.token);
}

module.exports = ShoppingCartManager;
