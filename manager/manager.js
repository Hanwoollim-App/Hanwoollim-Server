const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('../db'); // 데이터 설정이 있는 파일
const home = require('./manager_home');
var session = require('express-session'); //세션
var cookieParser = require('cookie-parser'); //쿠키

const kakao = {
    clientID: 'leejaeman0227',         /*  '카카오에서 받은clientID'  */
    clientSecret: '카카오에서 받은 clientSecret',
    redirectUri: '카카오에서 설정한 redirectUri'
};

var Idexsist = false;

// 관리자용 앱에서는 회원가입이 존재하지 않습니다. 따라서 manager_signup과 같은 파일도 없습니다
console.log('매니저 미들웨어 접근');

router.use(express.json());


//쿠키와 세션을 미들웨어로 등록한다
router.use(cookieParser());

router.use(session({
    userid: null, // 사용자 식별자를 새로 만들어준다.
    resave: false, 
    saveUninitialized: true, //초기화 되지 않은 세션을 강제로 저장한다. 이는 모든 방문자들에게 고유한 식별 값을 주는 것과 같다.
    secret: 'secret code', 
    cookie: {
        httpOnly: true, 
        secure: false,
    },
})) ;


// router.post('/manager', (req, res) => {
//     console.log(req.body)
// });


router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM MEMBER WHERE POSITION IN (1,2)', (err, rows, fields) => { // 테이블에서 직책이 1 또는 2인 사람만 가져온다.
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
        router.use('/home', home);
        console.log(req.session);
        res.redirect('/manager/home'); // home으로 리다이렉트
    } else {
        res.status(302); // 로그인 실패시
        res.redirect('/manager'); // 로그인 페이지로 이동
    }

    res.end();
});

module.exports = router;