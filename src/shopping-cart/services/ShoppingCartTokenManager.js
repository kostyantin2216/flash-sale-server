"use strict";

const Promise = require('promise');
const ShoppingCartToken = require('../model/ShoppingCartToken');

const TOKEN_TTL_MS = 60000;

const ShoppingCartTokenManager = (function() {
    const currentTokens = { };

    return {
        createToken: function() {
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
                return Promise.resolve(currentTokens[token].getTimeLeftToLive);
            } else {
                return Promise.reject(new Error('Invalid Token!'));
            }
        }
    };
})();

function onTokenExpired() {
    ShoppingCartTokenManager.deleteToken(this.token);
}

module.exports = ShoppingCartTokenManager;
