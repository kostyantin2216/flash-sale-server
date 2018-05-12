"use strict";

const SCTokenManager = require('./ShoppingCartTokenManager');

function buildResponse(token) {
    return new Promise((resolve, reject) => {
        SCTokenManager.getTimeLeftToLive(token).then(
            timeLeft => {
                resolve({
                    token: token,
                    timeLeftToLive: timeLeft
                });
            }, 
            reject
        );
    });
}

module.exports = {
    createResponse(token) {
        return new Promise((resolve, reject) => {
            if(token) {
                SCTokenManager.isValid(token).then(
                    isValid => {
                        if(isValid) {
                            buildResponse(token).then(resolve, reject);
                        } else {
                            reject(new Error('Invalid Token'));
                        }
                    },
                    reject
                );
            } else {
                SCTokenManager.createToken().then(
                    newToken => buildResponse(newToken).then(resolve, reject),
                    reject
                );
            }
        });
    }
}
