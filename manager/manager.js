const express = require('express');
const router = express.Router();

const pool = require('../db');
const home = require('./manager_home');

router.route('/')
    .get((req, res, next) => {
        res.status(200).json({ managername: 'areyoumanager?', managerpassword: 'really?'})
    })
    .post((req, res, next) => {
        let kakaoid = req.body.kakaoid;

        pool.getConnection((err, db) => {
            if(err) throw err;
            let sql = `SELECT * FROM MEMBER`;

            db.query(sql, (err, rows) => {
                if(err) throw err;

                rows.forEach(row => {
                    if(row.KAKAOID === kakaoid){
                        if((row.POSITION === 0) || (row.POSITION === 1)){
                            router.use('/home', home);
                            req.session.kakaoid = kakaoid;
                            req.session.save(() => {
                                res.redirect(200, '/manager/home');
                            });
                        }
                        else{
                            res.redirect(302, '/');
                        }
                    }
                });

                if(req.session === undefined){
                    res.redirect(302, '/');
                }
            });
            db.release();
        });
    });

module.exports = router;