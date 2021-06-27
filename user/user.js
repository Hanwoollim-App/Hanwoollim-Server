const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const pool = require('../db');
const signup = require('./user_signup');
const home = require('./user_home');

/* 로그인 실패란,  로그인 시도 했을 때 입력된 카톡 id 가 db에 없음을 뜻합니다 */

router.route('/')
    .get((req, res, next) => {
        // 유저용 앱에서 로그인 버튼을 누른 뒤 보여주는 로그인 페이지에 대한 '/user' 라우팅입니다
        res.send('/user login page');
    })
    .post((req, res, next) => {
        // 사용자 입력 데이터를 받아와 login 성공, 실패에 대한 로직을 처리합니다

        // 1. 로그인 성공 시, if문과 next()를 통해 '/user/home'으로 라우팅하고 home 미들웨어가 관리합니다
        router.use('/home', home);
        res.send('로그인 성공과 관련된 status code가 들어갑니다');

        // 2. 로그인 실패 시, else문과 next()를 통해 '/user/signup'으로 라우팅하고 signup 미들웨어가 관리합니다
        router.use('/signup', signup);
        res.send('로그인 실패와 관련된 status code 가 들어갑니다');
    });

module.exports = router;