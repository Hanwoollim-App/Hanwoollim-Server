const express = require('express');
const router = express.Router();

const pool = require('../db');

router.route('/')
    .get((req, res, next) => {
        pool.getConnection((err, db) => {
            if(err) throw err;
            let sql = `SELECT FROM MEMBER WHERE KAKAOID = ?`;

            db.query(sql, [req.session.kakaoid], (err, rows) => {
                if (err) throw err;

                if(rows[0].POSITION !== 0){
                    res.redirect(302, '/manager/home');
                }
                else{
                    res.status(200).json({membername: 'name', major: 'major', studentid: 'studentid'});
                }
            });
            db.release();
        });
    })
    .delete((req, res, next) => {
        let studentid = req.body.studentid;

        pool.getConnection((err, db) => {
            if(err) throw err;
            
            db.query(`SELECT * FROM MEMBER`, (err, member_rows) => {
                if(err) throw err;

                member_rows.forEach(member_row => {
                    if(member_row.STUDENTID === studentid){
                        db.query(`SELECT * FROM SESSIONS`, (err, session_rows) => {
                            if(err) throw err;

                            session_rows.forEach(session_row => {
                                if(member_row.KAKAOID === session_row.DATA.kakaoid){
                                    let session_id = session_row.SESSION_ID

                                    db.query(`DELETE FROM SESSIONS WHERE SESSION_ID = ?`,
                                    [session_id], (err, results) => {
                                        if(err) throw err;
                                    });
                                }
                            });
                        });
                    }
                });
            });

            db.query(`DELETE FROM MEMBER WHERE STUDENTID = ?`, [studentid], (err, rows) => {
                if(err) throw err;
            });
            db.release();
        }); 
    })
    .put((req, res, next) => {
        pool.getConnection((err, db) => {
            if(err) throw err;
            let studentid = req.body.studentid;
            let position = req.body.position;
            let sql = `UPDATE MEMBER SET POSITION = ? 
            WHERE STUDENTID = ?`;

            if(position === 0){
                db.query(sql, [position, studentid], (err, rows) => {
                    if(err) throw err;

                    req.session.destroy();
                    res.redirect(302, '/');
                });
            }
            else{
                db.query(sql, [position, studentid], (err, rows) => {
                    if(err) throw err;

                    res.redirect(200, '/manager/members');
                });
            }
            db.release();
        });
    });

module.exports = router;