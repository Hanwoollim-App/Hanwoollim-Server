const express = require('express');
const router = express.Router();

const pool = require('../db');
const members = require('./members');
// const notification = require('./notification');
// const jams = require('./jams');

router.use('/members', members);
// router.use('/notification', notification);
// router.use('/jams', jams);

module.exports = router;