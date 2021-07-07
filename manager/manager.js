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



const kakao = {
    clientID: 'leejaeman0227'
};


router.get('/', (req, res) => {
    var output = `
    <html>
        <body>
            <form method='post'>
            <p> <input type="text" name="kakaoid"> </p>
            <p> <input type="submit"> </p>
            </form>
        </body>
    </html>
    `
    res.send(output);
});

router.post('/', async(req, res, next) => {
    let kakaoid = req.body.kakaoid;
    //console.log(kakaoid);
    pool.getConnection((err, db) => {
        if(err) throw err;
        let sql = `SELECT * FROM MEMBER`;

        db.query(sql, (err, rows) => {
            if(err) throw err;

            rows.forEach(row => {
                if(row.KAKAOID === kakaoid){
                    if((row.POSITION === 0) || (row.POSITION === 1)){
                        console.log('로그인 성공');
                        router.use('/home', home);
                        req.session.kakaoid = kakaoid;
                        req.session.save(() => {
                            res.status(200);
                            res.redirect('/manager/home');
                        });
                    }
                    else{
                        console.log('로그인 실패, 일반회원입니다.');
                        res.status(302);
                        res.redirect('/');
                    }

                }
            });

            if(req.session === undefined){ // sid를 할당못 받았다는 뜻은 /가 아닌 /manager를 통해 들어왔다는 뜻.
                console.log('홈으로 돌아가서 재시도하세요');
                res.redirect(302, '/');
            }else{
                console.log('로그인 실패');
                console.log(req.body); // 이유를 알기 위해 받은 값 출력
                console.log(req.session); // 이유를 알기 위해 접속자 정보출력
                res.redirect(302, '/');
            }
        });
        db.release();
    });
});

module.exports = router;