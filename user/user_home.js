const express = require('express');
const router = express.Router();

const pool = require('../db');
const setting = require('./setting/user_home_setting');
const reservation = require('./reservation/user_home_reservation');

// setting, reservation, meeting, today-... 모든 것과 연결되는 곳입니다.
router.use('/setting', setting);
router.use('/reservation', reservation);

// [...님] 공지사항, 오늘의 연습실 예약, 오늘의 번개모임
// /user/home/notification, today-reservation, today-meeting, reservation, meeting, board

router.get('/', (req, res, next) => {
    // session이 undefined일 경우 무언가 문제가 생긴 것이므로 '/user'로 쏴서 재로그인을 요구합니다.
    if(req.session.kakaoid === undefined){
        res.redirect(302, '/user');
    }
    else{
        pool.getConnection((err, db) => {
            if(err) throw err;
            let sql = `SELECT * FROM MEMBER WHERE KAKAOID = ?`;
        
        // 유저가 모종의 이유로 session_id가 변경되었을 때 이전에 사용하던 session_id에 해당하는 
        // sessions테이블의 row는 적체됩니다. 따라서 1명의 유저는 1개의 sessions테이블 row만 차지하도록
        // homepage에 진입할 때마다 sessinons 테이블을 순회하며 중복에 대해 검사합니다.

            db.query(`SELECT * FROM SESSIONS`, (err, rows) => {
                if(err) throw err;
                let sessions = [];

            // 1. 현재 session객체의 kakaoid를 기준으로 sessions 테이블에서 해당 kakaoid를 지니는 row를 모두 찾는다.
            // 2. 모두 찾아 각 row의 session_id를 배열(sessions)에 저장한다.
            // 3. 만약 sessions배열의 길이가 1보다 크다면 적체된 게 있다는 뜻이다. 
            // 4. push메소드에 기반했기 때문에, 가장 마지막에 들어온 session_id는 현재 사용자의 session_id이다.
            
                rows.forEach(row => {
                    let data = JSON.parse(row.data);

                    if(req.session.kakaoid === data.kakaoid){
                        let session_id = row.session_id;
                        sessions.push(session_id);
                    }
                });

                if(sessions.length > 1){
                    let i = 0;

                    // 가장 마지막 session_id는 현재 유저의 id이므로 삭제하지 않기 위해 session.length - 1을 한다.
                    while(i < sessions.length - 1){
                        db.query(`DELETE FROM SESSIONS WHERE SESSION_ID = ?`, [sessions[i]], (err, rows) => {
                            if(err) throw err;
                        });
                        i++;
                    }
                }
            });

            // 1. 미허가 회원(POSITION값이 3)일 경우 '/user/home'으로 다시 리다이렉션 하여 진입을 막습니다.
            // 2. 허가된 회원일 경우 해당 membername을 json형식으로 클라이언트에 쏴줍니다.
            db.query(sql, [req.session.kakaoid], (err, rows) =>{
                if(err) throw err;
                let membername = rows[0].MEMBERNAME;
                let position = rows[0].POSITION;
                
                if(position === 3){
                    res.redirect(400, '/user/home');
                }
                else{
                    res.status(200).json({membername: `${membername}`});
                }
            });
            db.release();
        });
    }
});

module.exports = router;