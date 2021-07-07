const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const pool = require('./db');
//const user = require('./user/user');
const manager = require('./manager/manager');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: false}));


// DB연결
pool.getConnection(function(err, conn){
    if (err) {  // 에러 핸들링
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

app.use(session({
    key: 'hanwoolim',
    resave: false, 
    httpOnly: true,	//자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    saveUninitialized: true, //초기화 되지 않은 세션을 강제로 저장한다. 이는 모든 방문자들에게 고유한 식별 값을 주는 것과 같다.
    secret: 'secret code',
    store: new MySQLStore({
        host: 'localhost',
        user: 'root',
        port: 3306,
        password: 'dlwoaks0227',
        database: 'Han_woollim'
    }),
    cookie: {
        httpOnly: true
    }
})) ;

app.get('/', (req, res) => {
    res.status(200); // 클라이언트와 서버 연결
    res.redirect('/manager'); // 초기화면으로 이동
});


app.use('/manager', manager);

// 관리자용 앱에서 로그인 버튼 누를 시에, '/manager'로 라우팅하고 manager 미들웨어가 관리합니다

app.listen(port, ()=>{
    console.log(`Hanwoolim Server at port ${port}`);
});