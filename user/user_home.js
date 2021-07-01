const express = require('express');
const router = express.Router();

const pool = require('../db');
const setting = require('./user_home_setting');

router.use('/setting', setting);
// [...님] 공지사항, 오늘의 연습실 예약, 오늘의 번개모임

module.exports = router;