"use strict";

const SCTokenManager = require('./ShoppingCartTokenManager');

function buildResponse(token) {
    console.log('building response');
    return new Promise((resolve, reject) => {
        SCTokenManager.getExpirationTime(token).then(
            expirationTime => {
                resolve({
                    token: token,
                    expiresOn: expirationTime
                });
            }, 
            reject
        );
    });
}

module.exports = {
    createResponse(token) {
        console.log('creating response');
        return new Promise((resolve, reject) => {
            SCTokenManager.isValid(token).then(
                isValid => {
                    console.log('is valid', isValid);
                    if(isValid) {
                        buildResponse(token).then(resolve, reject);
                    } else {
                        reject(new Error('Invalid Token'));
                    }
                },
                reject
            );
        });
    }
}
