const ProductProperties = require('../model/ProductSchema').PROPERTIES;
const Promise = require('promise');
const s3Service = require('../../utilities/s3-service');
const resolvePath = require('object-resolve-path');

function toSummarized(product) {
    return {
        name: resolvePath(product, ProductProperties.NAME),
        brand: resolvePath(product, ProductProperties.BRAND),
        shortName: resolvePath(product, ProductProperties.SHORT_NAME),
        image: resolvePath(product, ProductProperties.IMAGES + '[0]'),
        price: resolvePath(product, ProductProperties.PRICE),
        retailPrice: resolvePath(product, ProductProperties.RETAIL_PRICE)
    };
}

function manyToSummarized(products) {
    let result = [];
    products.forEach(product => {
        result.push(toSummarized(product));
    });
    return result;
}

function toDetailed(product) {
    return new Promise((resolve, reject) => {
        s3Service.getProductDescription(resolvePath(product, ProductProperties.DESCRIPTION_URI)).then(
            (data) => {
                resolve({
                    name: resolvePath(product, ProductProperties.NAME),
                    brand: resolvePath(product, ProductProperties.BRAND),
                    price: resolvePath(product, ProductProperties.PRICE),
                    retailPrice: resolvePath(product, ProductProperties.RETAIL_PRICE),
                    description: data.Body.toString(),
                    features: resolvePath(product, ProductProperties.FEATURES),
                    variants: resolvePath(product, ProductProperties.VARIANTS),
                    shippingPrice: resolvePath(product, ProductProperties.SHIPPING_PRICE),
                    images: resolvePath(product, ProductProperties.IMAGES),
                    video: resolvePath(product, ProductProperties.VIDEO)
                });
            },
            (err) => {
                reject(err)
            }
        )
    });
}

module.exports = {

    summarize: toSummarized,

    summarizeMany: manyToSummarized,

    detailed: toDetailed

};
