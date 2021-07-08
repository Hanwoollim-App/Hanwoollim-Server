const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const port = process.env.PORT || 3000;

const pool = require('./db');
const user = require('./user/user');
const manager = require('./manager/manager');

app.use(session({
    key: 'hanwoolim',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        user: 'root',
        port: 3306,
        password: 'Hanwol2513671@whyremydel1@',
        database: 'hanwoolimserver'
    })
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//DB 연결테스트
pool.getConnection((err, db) => {
    if(err) throw err;
    console.log('Database "hanwoolimserver" Connected');
    db.release();
});

app.use('/user', user);
app.use('/manager', manager);

app.listen(port, ()=>{
    console.log(`Hanwoolim Server at port ${port}`);
});