const express = require('express');
const axios = require('axios');
const kakao = require('./user_kakao');
const router = express.Router();

const pool = require('../db');
const signup = require('./user_signup');
const home = require('./user_home');

router.use('/home', home);

router.route('/')
    .get((req, res, next) => {
        // token이 defined라면 바로 '/user/home'으로 쏴줍니다 (로그인 유지)
        if(req.session.token === undefined){
            res.status(200);
        }
        else{
            res.redirect(302, '/user/home');
        }
    });

// 1. RedirectURI 로직, axios를 이용해 token을 받아옴
// 2. 관리자용, 유저용 RedirectUri는 별개임
// 3. 카카오로그인, 동의 페이지(인가코드 받기)는 클라이언트에서 처리

// 토큰 받기는 서버에서 처리

router.route('/account/sign-in/kakao/callback')
    .get((req, res, next) => {
        const code = req.query.code;

        res.send('hi');
    });

module.exports = router;