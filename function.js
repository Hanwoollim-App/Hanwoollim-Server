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
const bdoyParser = require('body-parser');
const { text } = require('body-parser');
const router = express.Router();

var results=[];
// results 변수의 범위(scope) 문제도 해결됨.
var pushResults = function (rows) {
    // 5개만 가져오려면 i<6 하시면 되긴 하는데 전체를 다 가져오려면 이렇게 할 수 있습니다.
    for (var i=0; i<results.length; i++) {
        results.push(rows[i].resultId);
    }
}

db.getConnection(connection);

// 필요할 때만 콜함
connection.query(`SELECT * FROM Member WHERE KAKAOID = "BALBLA"`, function (err, rows, fields) {
    if (!err) {
        pushResults(results);
        console.log('The solution is: ', results);
    } else {
        console.log('Error while performing Query. ', err);
    }});

connection.realease();