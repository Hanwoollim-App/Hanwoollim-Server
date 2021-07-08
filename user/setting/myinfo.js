const express = require('express');
const router = express.Router();

const pool = require('../../db');

router.route('/')
    .get((req, res, next) => {
        // session이 undefined일 경우 무언가 문제가 생긴 것이므로 '/user'로 쏴서 재로그인을 요구합니다.
        if(req.session.kakaoid === undefined){
            res.redirect(302, '/user');
        }
        else{
            res.status(200);
        }
    })
    .put((req, res, next) => {
        let new_membername = req.body.membername;
        let new_studentid = req.body.studentid;
        let new_major = req.body.major;

        pool.getConnection((err, db) => {
            if(err) throw err;
            
            // 먼저 중복 학번입력에 대해 방어합니다
            db.query(`SELECT * FROM MEMBER`, (err, rows) => {
                if(err) throw err;
                
                rows.forEach(row => {
                    if(row.STUDENTID === new_studentid){
                        res.status(400);
                    }
                });
            });
            
            // 학번이 중복되지 않았을 경우 statusCode가 null이고
            // 중복되었을 경우엔 400이므로 패스합니다.
            if(res.statusCode === 200){
                let sql = `UPDATE MEMBER 
                SET MEMBERNAME = ?, STUDENTID = ?, MAJOR = ?
                WHERE KAKAOID = ?`;
    
                let array = [new_membername, new_studentid, new_major, 
                req.session.kakaoid];
                
                // 수정을 완료하고 setting화면으로 다시 쏴줍니다.
                db.query(sql, array, (err, rows) => {
                    if(err) throw err;

                    res.redirect(302, '/user/home/setting');
                });
            }   
            db.release();
        });
    });

module.exports = router;