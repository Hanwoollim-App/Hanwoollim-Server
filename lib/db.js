const mysql = require('mysql');
const db = mysql.createPool({
  connectionLimit: 10,
  host:'localhost',
  user:'root',
  password:'kim!1413',
  database:'HANWOOLLIM',
  debug: false
});

module.exports = db;