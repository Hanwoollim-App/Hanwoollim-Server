const express = require('express');
const router = express.Router();

const pool = require('../db');

router.route('/')
    .get((req, res, next) => {
        pool.getConnection((err, db) => {
            if(err) throw err;
            let sql = `SELECT FROM MEMBER WHERE KAKAOID = ?`;

            db.query(sql, [req.session.kakaoid], (err, rows) => {
                if(err) throw err;
                let membername = rows[0].MEMBERNAME;
                let major = rows[0].MAJOR;
                let studentid = rows[0].STUDENTID;

                res.status(200).json({name: `${membername}`, 
                major: `${major}`, studentid: `${studentid}`});
            });
            db.release();
        });
    })
    .put((req, res, next) => {
        let new_name = req.body.name;
        let new_studentid = req.body.studentid;
        let new_major = req.body.major;

        pool.getConnection((err, db) => {
            if(err)  throw err;
            let sql = `UPDATE MEMBER 
            SET MEMBERNAME = ?, STUDENTID = ?, MAJOR = ?
            WHERE KAKAOID = ?`;

            let array = [new_name, new_studentid, new_major, 
            req.session.kakaoid];

            db.query(sql, array, (err, rows) => {
                if(err) throw err;
                res.redirect(200, '/user/home/setting');   
            });
            db.release();
        });
    })
    .delete((req, res, next) => {
        pool.getConnection((err, db) => {
            if(err) throw err;
            let sql = `DELETE FROM MEMBER 
            WHERE KAKAOID = ?`;

            db.query(sql, [req.session.kakaoid], (err, rows) => {
                if(err) throw err;

                req.session.destroy();
                res.redirect(302, '/');
            });
        });
    });

module.exports = router;