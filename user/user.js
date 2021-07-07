const express = require('express');
const router = express.Router();

const pool = require('../db');
const signup = require('./user_signup');
const home = require('./user_home');

router.use('/home', home);

router.route('/')
    .get((req, res, next) => {
        // session이 defined라면 바로 '/user/home'으로 쏴줍니다 (로그인 유지)
        if(req.session === undefined){
            res.status(200);
        }
        else{
            res.redirect(302, '/user/home');
        }
    })
    .post((req, res, next) => {
        let kakaoid = req.body.kakaoid;
        
        // DB에 등록된 kakaoid 인지 확인합니다
        pool.getConnection((err, db) => {
            if (err) throw err;
            let sql = `SELECT * FROM MEMBER`;

            db.query(sql, (err, rows) => {
                if(err) throw err;

                rows.forEach(row => {
                    if(row.KAKAOID === kakaoid){
                        req.session.kakaoid = kakaoid;
                        req.session.save(() => {
                            res.redirect(200, '/user/home');
                        });
                    }
                });
        
        // 등록되지 않은 kakaoid 였을 경우, 위의 foreach에서 session을 할당받지 못해
        // 여전히 undefined라는 점을 이용해 signup 페이지로 보냅니다
                if(req.session === undefined){
                    router.use('/signup', signup);
                    req.session.kakaoid = kakaoid;
                    req.session.save(() => {
                        res.redirect(302, '/user/signup');
                    });
                }
            });
            db.release();
        });
    });

module.exports = router;