const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const pool = require('./db');
const user = require('./user/user');
const manager = require('./manager/manager');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//DB 연결테스트
pool.getConnection((err, db) => {
    if(err) throw err;
    console.log('Database "hanwoolimserver" Connected');
    db.release();
});

// 1. 앱에 들어갔을 때 처음으로 보이는 페이지에 대한 라우팅입니다
// 2. 유저용, 관리자용 공통입니다
app.get('/', (req, res) => {
    res.send('Hello Hanwoolim!');
});

// 유저용 앱에서 로그인 버튼 누를 시에, '/user'로 라우팅하고 user 미들웨어가 관리합니다
app.use('/user', user);

// 관리자용 앱에서 로그인 버튼 누를 시에, '/manager'로 라우팅하고 manager 미들웨어가 관리합니다
app.use('/manager', manager);

app.listen(port, ()=>{
    console.log(`Hanwoolim Server at port ${port}`);
});