const AWS = require('aws-sdk');
const ProductSchema = require('../model/ProductSchema');

module.exports = {

    getSummarizedProducts: function(category, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName : ProductSchema.TABLE_NAME,
            ProjectionExpression:`#nm, 
                                  ${ ProductSchema.PROPERTIES.RETAIL_PRICE }, 
                                  ${ ProductSchema.PROPERTIES.PRICE }, 
                                  ${ ProductSchema.PROPERTIES.MAIN_IMAGE }`,
            ExpressionAttributeNames:{
                '#nm': ProductSchema.PROPERTIES.NAME
            }
        };

        var results = [];

        if(category) {
            params['IndexName'] = ProductSchema.INDEXES.CATEGORY;
            params['KeyConditionExpression'] = `${ ProductSchema.PROPERTIES.CATEGORY } = :cat`;
            params['ExpressionAttributeValues'] = {
                ':cat': category
            };

            docClient.query(params, onResult);
        } else {
            docClient.scan(params, onResult);
        }

        function onResult(err, data) {
            if(err) {
                console.log('Error occured while scanning for products. Error JSON:', JSON.stringify(err, null, 2));
                callback(err);
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
                    callback(null, results);
                }
            }
        }
    },

    getProductDetails: function(name, category, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();

        var key = {};
        key[ProductSchema.PROPERTIES.NAME] = name;
        key[ProductSchema.PROPERTIES.CATEGORY] = category;

        var params = {
            TableName: ProductSchema.TABLE_NAME,
            Key: key
        };
        
        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Error while getting product. Error JSON:", JSON.stringify(err, null, 2));
                callback(err)
            } else {
                callback(null, data.Item);
            }
        });
    }

};