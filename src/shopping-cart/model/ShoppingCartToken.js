"use strict";

const uuidv4 = require('uuid/v4');

module.exports = class ShoppingCartToken {
    constructor(ttl, onExpired) {
        this.token = uuidv4();
        this.onExpired = onExpired.bind(this);
        this.ttl = ttl;
        this.lastUpdate = Date.now();

        this.expirationTimer = setTimeout(this.onExpired, this.ttl);
    }

    update() {
        clearTimeout(this.expirationTimer);
        this.lastUpdate = Date.now();
        this.expirationTimer = setTimeout(this.onExpired, this.ttl);
    }

    getTimeLeftToLive() {
        let timeAlive = Date.now() - this.lastUpdate;
        return this.ttl - timeAlive;
    }

    getExpirationTime() {
        return this.lastUpdate + this.ttl;
    }
}
