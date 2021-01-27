const mysql = require('mysql');
const connection = mysql.createPool({
  connectionLimit: 10,
  host:'',
  user:'',
  password:'',
  database:'',
  debug: false
});

module.exports = db;