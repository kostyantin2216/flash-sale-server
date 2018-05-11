"use strict";

const express = require('express');

const resultHandler = require('../utilities/server-utilities').jsonResultHandler;

const router = express.Router();

router.post('/add', stub('/add'));

router.get('/:token', stub('/:token'));

router.post('/:token/add', stub('/:token/add'));

router.delete('/:token/remove', stub('/:token/remove'));

router.get('/:token/valid', stub('/:token/valid'));

router.post('/:token/validate', stub('/:token/validate'));

module.exports = router;

function stub(path) {
    return function(req, res) {
        console.log(path.replace(':token', req.params.token), '-', JSON.stringify(req.body));
        res.json(req.body);
    }
}
