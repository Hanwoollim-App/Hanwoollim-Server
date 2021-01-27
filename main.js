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
const router = express.Router();

app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));

router.route('/signUp').post((req, res) => {
    let paramName = req.body.name;
    let paramStudentId = req.body.studentId;
    let paramMajor = req.body.major;
    let paramPosition = req.body.position;
    let paramKakaoId = req.body.kakaoId;
    signUp(paramName, paramStudentId, paramMajor, paramPosition, paramKakaoId, function(err){
        if(err){
            console.log(err);
            if(err.indexOf('1062')){
                res.send(-101);
                //학번 또는 카카오 아이디가 겹침
            }
        }
        else{
            res.send(100);

        }
    });
    }
);

router.route('/signIn').post((req, res) => {
    let paramKakaoid = req.body.kakaoid;
    signIn(paramKakaoid, function(err, results){
        if(err){
            console.log(err);
            res.send(-201);//카카오 아이디가 존재하지 않음
        }
        else{
            res.send(200);
            res.json({
                name : results[0],
                studentId : results[1],
                major : results[2],
                position : results[3]
            });
        }
    });
    }
);

var signUp = function(name, studentId, major, position, kakaoId, callback){
    db.getConnection(function(err, connection){
        if(err){
            if(connection){
                connection.release();
                
            }
            callback(err, null);
            return;
        }
        else{
            connection.query(`
            INSERT INTO Member (MEMBERNAME, STUDENTID, MAJOR, POSITION, KAKAOID) VALUES(?, ?, ?, ?, ?)`, [name, studentId, major, position, kakaoId], function(err, results){
                connection.release();

                if(err){
                    callback(err, null);
                    return;
                }
                else{
                    callback(null, results);
                    return;
                }
            });
        }
    });
    
}

var signIn = function(kakaoId, callback){
    db.getConnection(function(err,connection){
        if(err){
            if(connection){
                connection.release();
            }
            callback(err, null);
            return;
        }
        else{
            connection.query(`SELECT KAKAOID FROM Member WHERE KAKAOID = ?`, [kakaoId], function(err, results){
                connection.release();

                if(results.indexOf('Empty')){
                    callback(err, null);
                    return;
                }
                else{
                    connection.query(`SELECT MEMBERNAME, STUDENTID, MAJOR, POSITION FROM Member WHERE KAKAOID = ?`,[kakaoid], function(err, rows, fields){
                        if(err){
                            connection.release();
                            console.log(err);
                        }
                        else{
                            let results = [];
                            pushResults(results);
                            console.log('The solution is: ', results);
                        }
                    });
                    callback(null, results);
                    return;
                }
            }); 
        }
    })
}

var pushResults = function(rows){
    for(var i = 0; i < results.length; i++){
        results.push(rows[i].resultId);
    }
}