"use strict";

const resolvePath =         require('object-resolve-path');
const ProductProperties =   require('./ProductSchema').PROPERTIES;

module.exports = class DetailedProduct {
    constructor(product, description) {
        this.name =             resolvePath(product, ProductProperties.NAME);
        this.brand =            resolvePath(product, ProductProperties.BRAND);
        this.price =            resolvePath(product, ProductProperties.PRICE),
        this.retailPrice =      resolvePath(product, ProductProperties.RETAIL_PRICE);
        this.features =         resolvePath(product, ProductProperties.FEATURES);
        this.variants =         resolvePath(product, ProductProperties.VARIANTS);
        this.shippingPrice =    resolvePath(product, ProductProperties.SHIPPING_PRICE);
        this.images =           resolvePath(product, ProductProperties.IMAGES);
        this.video =            resolvePath(product, ProductProperties.VIDEO);
        this.description =      description;
    }
}
