const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const pool = require('./db');
//const user = require('./user/user');
const manager = require('./manager/manager');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res) => {
    res.status(200).send('메인화면 접속 성공'); //클라이언트와 서버 연결
});

// 관리자용 앱에서 로그인 버튼 누를 시에, '/manager'로 라우팅하고 manager 미들웨어가 관리합니다

app.use('/manager', manager);

app.listen(port, ()=>{
    console.log(`Hanwoolim Server at port ${port}`);
});