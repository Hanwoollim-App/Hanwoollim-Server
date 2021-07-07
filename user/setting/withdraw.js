const express = require('express');
const router = express.Router();

const pool = require('../../db');

router.route('/')
    .get((req, res, next) => {
        // session이 undefined인 경우 무언가 문제가 생긴 것이므로 '/user'로 쏴서 재로그인을 요구합니다.
        if(req.session === undefined){
            res.redirect(302, '/user');
        }
        else{
            res.status(200);
        }
    })
    .delete((req, res, next) => {
        pool.getConnection((err, db) => {
            if(err) throw err;
            let sql = `DELETE FROM MEMBER 
            WHERE KAKAOID = ?`;

            // session의 kakaoid를 이용해 DB에서 해당 유저를 삭제하고
            // sessions테이블에서도 destroy 합니다.
            db.query(sql, [req.session.kakaoid], (err, rows) => {
                if(err) throw err;

                req.session.destroy();
                res.redirect(302, '/user');
            });
        });
    });

module.exports = router;