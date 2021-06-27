const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const pool = require('../db');

// 로그인 정보가 db에 없을 때, '/user/signup'으로 라우팅되고 회원가입을 요구합니다
router.route('/')
    .get((req, res, next) => {
        res.send('/user/signup signup page');
    })
    .post((req, res, next) => {
        // 사용자 입력 데이터를 받아와 회원가입 로직을 처리합니다
        res.send('try signup');
    });

module.exports = router;