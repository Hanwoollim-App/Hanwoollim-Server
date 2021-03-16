const express = require('express');
const http = require('http');
const serveStatic = require('serve-static');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSessiion = require('express-session');
const expressErrorHandler = require('express-error-handler');
const app = express();
const port = 3000;
const db = require('./lib/db');
const bodyParser = require('body-parser');
const { indexOf } = require('methods');
const { error } = require('console');
const router = express.Router();

app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));

router.route('/signUp').post((req, res) => {
    let paramName = req.body.name;
    let paramStudentId = req.body.studentId;
    let paramMajor = req.body.major;
    let paramPosition = req.body.position;
    let paramKakaoId = req.body.kakaoId;
    try{
        signUp(paramName, paramStudentId, paramMajor, paramPosition, paramKakaoId, (err, results) => {
            try{
                res.send(100);
                return;
            }
            catch{
                if(err.indexOf('1062')){
                    res.send(-101);
                    return;
                }
            }
        });
    }
    catch{
        console.log(error);
    }
});

router.route('/signIn').post((req, res) => {
    let paramKakaoId = req.body.kakaoId;
    try{
        signIn(paramKakaoId, (err, results) =>{
            try{
                res.send(200);
                res.json({
                    name : results[0].MEMBERNAME,
                    studentId : results[0].STUDENTID,
                    major : results[0].MAJOR,
                    position : results[0].POSITION
                });
                return;
            }
            catch{
                res.send(-201);
                return;
            }
        });
    }
    finally{
        return;
    }
});

router.route('/reservation').post((req, res) => {
    let paramSession1= req.body.session1;
    let paramSession2= req.body.session2;
    let paramId= req.body.id;
    let paramDate = req.body.date;
    try{
        reservation(paramSession1, paramSession2, paramId, paramDate, (err, results) =>{
            try{
                res.send(300);
                res.json({
                    name : results[0].RID
                });
                return;
            }
            catch{
                res.send(-301);
                return;
            }
        });
    }
    finally{
        return;
    }
});

router.route('/getInfo').post((req, res) => {
    let paramKakaoId = req.body.kakaoId;
    try{
        getInfo(paramKakaoId, (err, results) =>{
            try{
                res.send(400);
                res.json({
                    name : results[0].MEMBERNAME,
                    studentId : results[0].STUDENTID,
                    major : results[0].MAJOR,
                    position : results[0].POSITION
                });
                return;
            }
            catch{
                res.send(-401);
                return;
            }
        });
    }
    finally{
        return;
    }
});
/*
router.route('/updateInfo').post((req, res) => {
    let paramName = req.body.name;
    let paramStudentId = req.body.studentId;
    let paramMajor = req.body.major;
    let paramPosition = req.body.position;
    let paramKakaoId = req.body.kakaoId;
    try{
        signUp(paramName, paramStudentId, paramMajor, paramPosition, paramKakaoId, (err, results) => {
            try{
                res.send(500);
                return;
            }
            catch{
                res.send(-501);
                return;
            }
        });
    }
    catch{
        console.log(error);
    }
});
*/
var signUp = (name, studentId, major, position, kakaoId, callback) => {
    try{
        db.getConnection((err,connection) => {
            try{
                connection.query(`INSERT INTO MEMBER (MEMBERNAME, STUDENTID, MAJOR, POSITION, KAKAOID) VALUES(?, ?, ?, ?, ?)`, [name, studentId, major, position, kakaoId], (err,results) => {
                    try{
                        callback(null, results);
                        return;        
                    }
                    finally{
                        connection.release();
                        return;
                    }
                });
            }
            catch{
                callback(err, null);
                connection.release();
                return;
            }
        });
    }
    catch{
        if(connection){
            connection.release();
            return;
        }
        callback(err, null);
        return;
    }
}

var signIn = (kakaoId, callback) => {
    try{
        db.getConnection((err,connection) => {
            try{
                connection.query(`SELECT KAKAOID FROM MEMBER WHERE KAKAOID = ?`, [kakaoId], (err, results) => {
                    if(results.indexOf('Empty')){
                        throw error;
                    }
                    try{
                        connection.query(`SELECT MEMBERNAME, STUDENTID, MAJOR, POSITION FROM MEMBER WHERE KAKAOID = ?`, [kakaoId], (err, rows, fields) => {
                            try{
                                callback(null, results);
                                return;
                            }
                            finally{
                                connection.release();
                                return;
                            }
                        });
                    }
                    catch{
                        callback(err, null);
                        return;
                    }
                });
            }
            catch{
                connection.release();
                callback(err, null);
                return;
            }
        });
    }
    catch{
        if(connection){
            connection.release();
        }
        callback(err, null);
        return;
    }
}

var reservation = (session1, session2, id, date, callback) => {
    try{
        db.getConnection((err,connection) => {
            try{
                connection.query(`SELECT DATE FROM RESERVATION WHERE DATE = ?`, [date], (err, results) => {
                    if(!results.indexOf('Empty')){
                        throw error;
                    }
                    try{
                        connection.query(`INSERT INTO RESERVATAION (SESSION1, SESSION2, ID, DATE) VALUES(?, ?, ?, ?)`, [session1, session2, id, date], (err,results) => {
                            try{
                                connection.query(`SELECT LAST_INSERT_ID()`, [], (err, results) => {
                                    try{
                                        callback(null, results);
                                        return;
                                    }
                                    finally{
                                        connection.release();
                                        return;
                                    }
                                });
                            }
                            catch{
                                callback(err, null);
                                return;
                            }
                        });
                    }
                    catch{
                        callback(err, null);
                        return;
                    }
                });
            }
            catch{
                connection.release();
                callback(err, null);
                return;
            }
        });
    }
    catch{
        if(connection){
            connection.release();
        }
        callback(err, null);
        return;
    }
}

// "내 예약 확인하기" 기능 구현에 대한 2가지 방안이 있음, session-id 구현 방안 있음
// 현재는 미구현 상태, 추가 예정
var getInfo = (kakaoId, callback) => {
    try{
        db.getConnection((err,connection) => {
            try{
                connection.query(`SELECT KAKAOID FROM MEMBER WHERE KAKAOID = ?`, [kakaoId], (err, results) => {
                    if(results.indexOf('Empty')){
                        throw error;
                    }
                    try{
                        connection.query(`SELECT MEMBERNAME, STUDENTID, MAJOR, POSITION FROM MEMBER WHERE KAKAOID = ?`, [kakaoId], (err, rows, fields) => {
                            try{
                                callback(null, results);
                                return;
                            }
                            finally{
                                connection.release();
                                return;
                            }
                        });
                    }
                    catch{
                        callback(err, null);
                        return;
                    }
                });
            }
            catch{
                connection.release();
                callback(err, null);
                return;
            }
        });
    }
    catch{
        if(connection){
            connection.release();
        }
        callback(err, null);
        return;
    }
}

/*
var updateInfo = (name, studentId, major, position, kakaoId, callback) => {
    try{
        db.getConnection((err,connection) => {
            try{
                connection.query(`SELECT KAKAOID FROM MEMBER WHERE KAKAOID = ?`, [kakaoId], (err, results) => {
                    if(results.indexOf('Empty')){
                        throw error;
                    }
                    try{
                        connection.query(`UPDATE MEMBER SET MEMBERNAME = ?, STUDENTID = ?, MAJOR = ?, POSITION = ? WHERE KAKAOID = ?`, [name, studentId, major, position, kakaoId], (err, results) => {
                            try{
                                callback(null, results);
                                return;
                            }
                            finally{
                                connection.release();
                                return;
                            }
                        });
                    }
                    catch{
                        callback(err, null);
                        return;
                    }
                });
            }
            catch{
                connection.release();
                callback(err, null);
                return;
            }
        });
    }
    catch{
        if(connection){
            connection.release();
        }
        callback(err, null);
        return;
    }
}
*/