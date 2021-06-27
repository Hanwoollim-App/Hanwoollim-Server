const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const pool = require('../db');
const home = require('./manager_home');

// 관리자용 앱에서는 회원가입이 존재하지 않습니다. 따라서 manager_signup과 같은 파일도 없습니다

router.route('/')
    .get((req, res, next) => {
        // 관리자용 앱에서 로그인 버튼을 누른 뒤 보여주는 로그인 페이지에 대한 '/manager' 라우팅입니다
    })
    .post((req, res, next) => {
        // 1. 서버에서 선정한 회장, 회장이 선정한 집행부 멤버들에 대해서만 로그인을 허용합니다

        // 2. 로그인 성공 시, if문과 next()를 이용해'/manager/home'으로 라우팅하고 (manager폴더의)home 미들웨어가 관리합니다
        router.use('/home', home);
        res.send('로그인 성공과 관련된 status code가 들어갑니다');
        
        // 3. 로그인 실패 시, else문과 '/manager'로 리다이렉션 합니다.
        res.send('로그인 성공과 관련된 status code가 들어갑니다');
    });

module.exports = router;