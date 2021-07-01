const express = require('express');
const router = express.Router();

const pool = require('../db');
const signup = require('./user_signup');
const home = require('./user_home');

router.route('/')
    .get((req, res, next) => {
        res.status(200).json({ username: 'Please Enter Username', password: 'Please Enter Password'});
    })
    .post((req, res, next) => {
        let kakaoid = req.body.kakaoid;

        pool.getConnection((err, db) => {
            if (err) throw err;
            let sql = `SELECT * FROM MEMBER`;

            db.query(sql, (err, rows) => {
                if(err) throw err;

                rows.forEach(row => {
                    if(row.KAKAOID === kakaoid){
                        router.use('/home', home);
                        req.session.kakaoid = kakaoid;
                        req.session.save(() => {
                            res.redirect(200, '/user/home');
                        });
                    }
                });

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