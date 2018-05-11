"use strict";

module.exports = class ShoppingCart {
    constructor(cart) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.products = cart.products;
        this.token = cart.token;
    }
}
