console.log('DB 미들웨어 접근');

var mysql = require('mysql');
require('dotenv').config(); // env을 사용하기 위해서 필요한 모듈
var pool = mysql.createPool({ //.env 파일에 각 정보들을 저장해서 로드
    host    : process.env.DB_HOST,
    port    : process.env.DB_PORT,
    user    : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    connectionLimit: 30
});

module.exports = pool;





