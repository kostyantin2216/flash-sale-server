"use strict";

const S3 = require('aws-sdk/clients/s3'); 
const Promise = require('promise');

const s3 = new S3({
    region: "eu-west-2"
});

module.exports = {
    getProductDescription(uri) {
       return new Promise(function(fulfill, reject) {
            s3.getObject({Bucket: 'product-descriptions', Key: uri}, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    fulfill(data);
                } 
            });
       });
    }
}