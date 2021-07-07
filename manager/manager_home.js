const express = require('express');
const pool = require('../db');
const router = express.Router();

// 로그인을 거친 세션인지 검토



/* 
*   " 부원 명단 관리 " 와 " 고정 팀별 합주 등록 "에 대한 미들웨어 설정이 들어갑니다
*/
console.log('manager_home 접근');

router.get('/', (req, res) => {
    // if (!req.session.userid) {
    //     return res.status(302).send("authenticateFailedUser");
    // }else{
    //     console.log(req.session.userid);
    // }
    res.send("");
});


// 명단 불러오기
router.get('/', (req, res, next) => {
    res.send('매니저 home 페이지 연결');
    pool.query('SELECT * FROM MEMBER', (err, rows, fields) => { // 테이블에서 직책이 1 또는 2인 사람만 가져온다.
        console.log('관리자 테이블 접근 성공 m_h');
        if (err) {    // 에러체크
            console.log(err);
        } else {
            for (var i = 0; i < rows.length; i++) { // 테이블을 한 줄씩 읽어가며 KAKAOID가 존재하는지 확인
                console.log(rows[i].SID, rows[i].MEMBERNAME, rows[i].STUDENTID, rows[i].MAJOR, rows[i].POSITION, rows[i].KAKAOID);
            }
        }
    })
});

module.exports = router;