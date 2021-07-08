const express = require('express');
const router = express.Router();

const pool = require('../db');
const home = require('./user_home');

router.route('/')
    .get((req, res, next) => {
        // session이 defined라면 정상적으로 로그인 시도후 회원 가입페이지로 온 거고,
        // undefined이면 무언가 문제가 생긴 것이므로 '/user'로 다시 쏴서 재로그인을 요구합니다.
        if(req.session.kakaoid === undefined){
            res.redirect(302, '/user');
        }
        else{
            res.status(200);
        }
    })
    .post((req, res, next) => {
        let membername = req.body.membername;
        let studentid = req.body.studentid;
        let major = req.body.major;

        pool.getConnection((err, db) => {
            if (err) throw err;
            let sql = `INSERT INTO MEMBER (MEMBERNAME, STUDENTID, MAJOR, KAKAOID, POSITION)
            VALUES(?, ?, ?, ?, ?)`;

        // 학번이 겹치는 상황에 대해 방어합니다. (400을 답변)
            db.query(`SELECT * FROM MEMBER`, (err, rows) => {
                if(err) throw err;

                rows.forEach((row) => {
                    if(row.STUDENTID === studentid){
                        res.status(400);
                    }
                });
            });
        
        // 만약 위에서 겹치는 학번이 있었다면 statusCode 가 null이 아니므로(400) 지나칩니다.
        // null일 경우, 겹치는 학번이 없으므로 DB에 insert 해줍니다.
        // 관리자용 앱에서 2(일반부원)으로 변경해줍니다. 가입 시에는 default로 position값에 3(미허가)을 넣어줍니다.
            if(res.statusCode === 200){
                db.query(sql, [membername, studentid, major, req.session.kakaoid, 3], (err, rows) => {
                    if(err) throw err;
                });
                
                res.redirect(302, '/user/home');
            }
            db.release();
        });
    });

module.exports = router;