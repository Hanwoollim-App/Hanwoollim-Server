const express = require('express');
const router = express.Router();

const pool = require('../../db');

router.route('/')
    .get((req, res, next) => {
        res.send('Welcome Reservation Page...');
    });

module.exports = router;