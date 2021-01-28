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
                connection.query(`SELECT KAKAOID FROM Member WHERE KAKAOID = ?`, [kakaoId], (err, results) => {
                    if(results.indexOf('Empty')){
                        throw error;
                    }
                    try{
                        connection.query(`SELECT MEMBERNAME, STUDENTID, MAJOR, POSITION FROM Member WHERE KAKAOID = ?`, [kakaoId], (err, rows, fields) => {
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