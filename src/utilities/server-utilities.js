"use strict";

module.exports = {

    /**
     * Used as a general purpose error first callback with a single result to be returned as json.
     * Return error code 500 in case of an error. 
     * Make sure to bind this to the response before use.
     */
    jsonResultHandler: function(err, result) {
        if(err) {
            console.log('ERROR:', JSON.stringify(err));
            this.status(500).json({ error: err });
        } else {
            this.json(result);
        }
    }
}