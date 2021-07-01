const express = require('express');
const router = express.Router();

const pool = require('../db');
const home = require('./user_home');

router.route('/')
    .get((req, res, next) => {
        res.status(200).json({ username: 'Signup Username', password: 'Signup Password'});
    })
    .post((req, res, next) => {
        let name = req.body.name;
        let studentid = req.body.studentid;
        let major = req.body.major;

        pool.getConnection((err, db) => {
            if (err) throw err;
            let sql = `INSERT INTO MEMBER (MEMBERNAME, STUDENTID, MAJOR, KAKAOID)
            VALUES(?, ?, ?, ?)`;

            db.query(sql, [name, studentid, major, req.session.kakaoid], (err, rows) => {
                if(err) throw err;
            });
            
            router.use('/home', home);
            res.redirect(302, '/user/home');
            db.release();
        });
    });

module.exports = router;