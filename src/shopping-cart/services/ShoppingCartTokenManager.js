"use strict";

const Promise = require('promise');
const ShoppingCartToken = require('../model/ShoppingCartToken');

const TOKEN_TTL_MS = 3600000;

const ShoppingCartTokenManager = (function() {
    const currentTokens = { };

    return {
        createToken: function(onTokenExpired) {
            let newToken = new ShoppingCartToken(TOKEN_TTL_MS, onTokenExpired);
            currentTokens[newToken.token] = newToken;
            console.log('ShoppingCartTokenManager:', 'Created token ' + newToken.token);
            return Promise.resolve(newToken.token);
        },

        isValid: function(token) {
            return Promise.resolve(token && currentTokens[token] !== undefined);
        },

        deleteToken: function(token) {
            if(currentTokens[token]) {
                delete currentTokens[token];
                console.log('ShoppingCartTokenManager:', 'Deleted token ' + token);
            }
        },

        updateToken: function(token) {
            if(currentTokens[token]) {
                currentTokens[token].update();
            }
        },

        getTimeLeftToLive: function(token) {
            if(currentTokens[token]) {
                return Promise.resolve(currentTokens[token].getTimeLeftToLive());
            } else {
                return Promise.reject(new Error('Invalid Token!'));
            }
        },

        getLastUpdateTime: function(token) {
            if(currentTokens[token]) {
                return Promise.resolve(currentTokens[token].lastUpdate);
            } else {
                return Promise.reject(new Error('Invalid Token!'));
            }
        },

        getExpirationTime: function(token) {
            if(currentTokens[token]) {
                return Promise.resolve(currentTokens[token].getExpirationTime());
            } else {
                return Promise.reject(new Error('Invalid Token!'));
            }
        }
    };
})();

module.exports = ShoppingCartTokenManager;
