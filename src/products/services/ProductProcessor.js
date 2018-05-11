"use strict";

const Promise =             require('promise');
const resolvePath =         require('object-resolve-path');

const ProductProperties =   require('../model/ProductSchema').PROPERTIES;
const DetailedProduct =     require('../model/DetailedProduct');
const SummarizedProduct =   require('../model/SummarizedProduct');
const s3Service =           require('../../services/s3-service');

module.exports = {

    /**
     * @param product a product defined in {@link ProductProperties}
     * @returns SummarizedProduct {@link SummarizedProduct} 
     *          a summary of the original product.
     */
    summarize: toSummarized,

    /**
     * @param products a list of products defined in {@link ProductProperties}
     * @returns SummarizedProduct[] {@link SummarizedProduct} 
     *          a list of summaries of the original products.
     */
    summarizeMany: manyToSummarized,

    /**
     * @param product a product defined in {@link ProductProperties}
     * @returns DetailedProduct {@link DetailedProduct} 
     *          a detailed representation of the original product.
     */
    detailed: toDetailed

};

function toSummarized(product) {
    return Promise.resolve(new SummarizedProduct(product));
}

function manyToSummarized(products) {
    let result = [];
    products.forEach(product => {
        result.push(toSummarized(product));
    });
    return Promise.all(result);
}

function toDetailed(product) {
    return new Promise((resolve, reject) => {
        s3Service.getProductDescription(resolvePath(product, ProductProperties.DESCRIPTION_URI)).then(
            data => resolve(new DetailedProduct(product, data.Body.toString())),
            reject
        )
    });
}
