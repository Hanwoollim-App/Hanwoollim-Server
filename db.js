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

console.log('DB 미들웨어 접근');
pool.getConnection(function(err, conn){
    if (err) {  //에러 핸들링
        switch (err.code){
            case "PROTOCOL_CONNECTION_LOST":
                console.error("Database connection was closed.");
                break;
            case "ER_CON_COUNT_ERROR":
                console.error("Database has too many connections.");
                break;
            case "ECONNREFUSED":
                console.error("Database connection was refused.");
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.error("Access denied.");
        }
    }
    
    if (conn){ 
        console.log('Pool Connection 생성');
        return conn.release();
    }
});

module.exports = pool;





