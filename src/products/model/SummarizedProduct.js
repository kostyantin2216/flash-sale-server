"use strict";

const resolvePath =         require('object-resolve-path');
const ProductProperties =   require('./ProductSchema').PROPERTIES;

module.exports = class SummarizedProduct {
    constructor(product) {
        this.name =         resolvePath(product, ProductProperties.NAME);
        this.brand =        resolvePath(product, ProductProperties.BRAND);
        this.shortName =    resolvePath(product, ProductProperties.SHORT_NAME);
        this.image =        resolvePath(product, ProductProperties.IMAGES + '[0]');
        this.price =        resolvePath(product, ProductProperties.PRICE);
        this.retailPrice =  resolvePath(product, ProductProperties.RETAIL_PRICE);
    }
}