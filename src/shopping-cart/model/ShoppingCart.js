"use strict";

module.exports = class ShoppingCart {
    constructor(token) {
        this.products = [];
        this.token = token;
    }    

    addProduct(newProduct) {
        const product = this.findProduct(newProduct.brand, newProduct.name);
        if (product !== null) {
            const varaintTypes = Object.keys(newProduct.variants);
            if (varaintTypes.length > 0) {
                const varaintType = varaintTypes[0];
                if (varaintType === 'stock') {
                    if (newProduct.variants.stock) {
                        product.variants.stock += newProduct.variants.stock;
                    } else {
                        return new Error('This product must provide a stock count as a variant.');
                    }
                } else {
                    const variants = newProduct.variants[varaintType];
                    for (let i = 0; i < variants.length; i++) {
                        const variant = variants[i];
                        const variantNames = Object.keys(variant);
                        if (variantNames.length > 0) {
                            const variantName = variantNames[0];
                            const stock = newProduct.variants[varaintType][i][variantName].stock;

                            let foundVariant = false;
                            let existingVariants = product.variants[varaintType];
                            if (existingVariants) {
                                for (let j = 0; j < existingVariants.length; j++) {
                                    const existingVariant = existingVariants[j];
                                    const existingVariantNames = Object.keys(existingVariant);
                                    if (existingVariantNames.length > 0) {
                                        const existingVariantName = existingVariantNames[0];

                                        if (existingVariantName === variantName) {
                                            product.variants[varaintType][j][variantName].stock += stock;
                                            foundVariant = true;
                                            break;
                                        }
                                    }
                                }
                            } else {
                                product.variants[varaintType] = [];
                                existingVariants = product.variants[varaintType];
                            }
                            if (!foundVariant) {
                                existingVariants.push({
                                    [variantName]: {
                                        stock: stock
                                    }
                                });
                            }
                        }
                    }
                }
            } else {
                return new Error('This product does not contain any variants');
            }
        } else {
            this.products.push(newProduct);
        }
    }

    findProduct(brand, name) {
        for (const product of this.products) {
            if (brand === product.brand && name === product.name) {
                return product;
            }
        }
        return null;
    }

    productExists(product) {
        return this.findProduct(product.brand, product.name) !== null;
    }
}
