const express = require('express');
const router = express.Router();

const pool = require('../../db');
const myinfo = require('./myinfo');
const withdraw = require('./withdraw');

router.use('/myinfo', myinfo);
router.use('/withdraw', withdraw);

router.route('/')
    .get((req, res, next) => {
        // session이 undefined라면 문제가 생긴 것이므로 '/user'로 쏴서 재로그인을 요구합니다.
        if(req.session.kakaoid === undefined){
            res.redirect(302, '/user');
        }
        else{
            pool.getConnection((err, db) => {
                if(err) throw err;
                let sql = `SELECT * FROM MEMBER WHERE KAKAOID = ?`;
                
                // setting을 눌렀을 때 현재 사용자 정보를 보여주기 위해 이름, 학번, 학과를 
                // json형식으로 클라이언트에 보내줍니다.
                db.query(sql, [req.session.kakaoid], (err, rows) => {
                    if(err) throw err;
                    let membername = rows[0].MEMBERNAME;
                    let major = rows[0].MAJOR;
                    let studentid = rows[0].STUDENTID;

                    res.status(200).json({membername: `${membername}`, major:`${major}`, studentid: `${studentid}`});
                });
                db.release();
            });
        }
    });

module.exports = router;