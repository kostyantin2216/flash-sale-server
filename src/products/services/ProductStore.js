"use strict";

const AWS = require('aws-sdk');
const ProductSchema = require('../model/ProductSchema');

const SUMMARIZED_PROJECTION_EXPRESSION = `#nm, 
                                         ${ ProductSchema.PROPERTIES.BRAND },
                                         ${ ProductSchema.PROPERTIES.RETAIL_PRICE }, 
                                         ${ ProductSchema.PROPERTIES.PRICE }, 
                                         ${ ProductSchema.PROPERTIES.IMAGES },
                                         ${ ProductSchema.PROPERTIES.SHORT_NAME }`;

function getProduct(params) {
    return new Promise((resolve, reject) => {
        let docClient = new AWS.DynamoDB.DocumentClient();

        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Error while getting product. Error JSON:", JSON.stringify(err, null, 2));
                reject(err)
            } else {
                resolve(data.Item);
            }
        });
    });
}

module.exports = {

    getSummarizedProducts: function(processor) {
        return new Promise((resolve, reject) => {
            var docClient = new AWS.DynamoDB.DocumentClient();

            var params = {
                TableName : ProductSchema.TABLE_NAME,
                ProjectionExpression: SUMMARIZED_PROJECTION_EXPRESSION,
                ExpressionAttributeNames:{
                    '#nm': ProductSchema.PROPERTIES.NAME
                }
            };
    
            var results = [];
    
            /* if(category) {
                params['IndexName'] = ProductSchema.INDEXES.CATEGORY;
                params['KeyConditionExpression'] = `${ ProductSchema.PROPERTIES.CATEGORY } = :cat`;
                params['ExpressionAttributeValues'] = {
                    ':cat': category
                };
    
                docClient.query(params, onResult);
            } else {
                docClient.scan(params, onResult);
            } */
    
            docClient.scan(params, onResult);

            function onResult(err, data) {
                if(err) {
                    console.log('Error occured while scanning for products. Error JSON:', JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    data.Items.forEach(function(product) {
                        results.push(product);
                    });
    
                    // continue scanning if we have more products, because
                    // scan can retrieve a maximum of 1MB of data
                    if (typeof data.LastEvaluatedKey != "undefined") {
                        params.ExclusiveStartKey = data.LastEvaluatedKey;
                        docClient.scan(params, onResult);
                    } else {
                        if(processor === undefined) {
                            resolve(results);
                        } else {
                            processor(results).then(resolve, reject);
                        }
                    }
                }
            }
        });
    },

    getSummarizedProduct(brand, name, processor) {
        return new Promise((resolve, reject) => {
            var key = {};
            key[ProductSchema.PROPERTIES.NAME] = name;
            key[ProductSchema.PROPERTIES.BRAND] = brand;

            var params = {
                TableName: ProductSchema.TABLE_NAME,
                Key: key,
                ProjectionExpression: SUMMARIZED_PROJECTION_EXPRESSION,
                ExpressionAttributeNames: {
                    '#nm': ProductSchema.PROPERTIES.NAME
                }
            };

            if(processor === undefined) {
                getProduct(params).then(resolve, reject);
            } else {
                getProduct(params).then(
                    product => processor(product).then(resolve, reject),
                    reject
                );
            }
        });
    },

    getProductDetails: function(brand, name, processor) {
        return new Promise((resolve, reject) => {
            var docClient = new AWS.DynamoDB.DocumentClient();

            var key = {};
            key[ProductSchema.PROPERTIES.NAME] = name;
            key[ProductSchema.PROPERTIES.BRAND] = brand;

            var params = {
                TableName: ProductSchema.TABLE_NAME,
                Key: key
            };

            if(processor === undefined) {
                getProduct(params).then(resolve, reject);
            } else {
                getProduct(params).then(
                    product => processor(product).then(resolve, reject),
                    reject
                );
            }
        });
    }

};