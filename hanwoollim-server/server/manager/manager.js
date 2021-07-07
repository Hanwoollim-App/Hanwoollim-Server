console.log('매니저 미들웨어 접근');

const express = require('express');
// const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('../db'); // 데이터베이스 설정
const home = require('./manager_home');
var session = require('express-session'); //세션
// var cookieParser = require('cookie-parser'); //쿠키


var Idexsist = false;

// 관리자용 앱에서는 회원가입이 존재하지 않습니다. 따라서 manager_signup과 같은 파일도 없습니다

// router.use(express.json()); // app에서 했으므로 또 할 필요없음


router.get('/manager', (req, res) => {
    pool.query('SELECT * FROM MEMBER WHERE POSITION IN (1,2)', (err, rows) => { // 테이블에서 직책이 1 또는 2인 사람만 가져온다.
        console.log('관리자 테이블 접근 성공');
        if (err) {    // 에러체크
            console.log(err);
        } else {
            for (var i = 0; i < rows.length; i++) { // 테이블을 한 줄씩 읽어가며 KAKAOID가 존재하는지 확인
                //console.log("SID MEMBERNAME STUDENTID MAJOR POISITION KAKAOID");
                //console.log(rows[i].SID , rows[i].MEMBERNAME , rows[i].STUDENTID , rows[i].MAJOR , rows[i].POISITION , rows[i].KAKAOID);
                if (rows[i].KAKAOID == kakao.clientID) { // 관리자 명단에 이름이 있다면
                    console.log('관리자 명단에 이름이 있습니다.');
                    Idexsist = true;

                    req.session.userid = rows[i].KAKAOID; // 사용자 식별자는 카톡아이디로 받는다.
                    break;
                }
            }
        }
    })


    if (Idexsist == true) {
        res.status(200); // 로그인 성공시
        router.use('/manager_home', home);
        res.redirect('/manager/home'); // home으로 리다이렉트
        return;
    } else {
        res.status(302); // 로그인 실패시
        res.redirect('/manager'); // 로그인 페이지로 이동
    }

    res.end();
});

module.exports = router;